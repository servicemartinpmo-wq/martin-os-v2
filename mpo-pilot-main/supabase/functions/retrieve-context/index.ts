import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  callGemini,
  clamp,
  handleCorsPreflight,
  restInsert,
  restSelect,
  jsonResponse,
  rpc,
} from "../_shared/brain.ts";

/**
 * RETRIEVE-CONTEXT EDGE FUNCTION
 *
 * Retrieves relevant context from domain-specific knowledge base using RAG.
 * Performs semantic search with vector embeddings and reranking.
 *
 * Request format:
 * {
 *   domain: "pmo_ops" | "tech_ops" | "miidle",
 *   run_id: string,
 *   request_id: string,
 *   profile_id: string,
 *   input: string
 * }
 *
 * Response format:
 * {
 *   run_id: string,
 *   context_pack: {
 *     documents: array,
 *     frameworks: array,
 *     past_cases: array,
 *     summary: string
 *   },
 *   retrieval_metadata: {
 *     top_k: number,
 *     avg_similarity: number,
 *     query_time_ms: number
 *   }
 * }
 */

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const body = await req.json();

    const domain = String(body?.domain ?? "pmo_ops");
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const input = String(body?.input ?? "");
    const topK = Number(body?.top_k ?? 8);

    if (!profileId || !runId) {
      return jsonResponse({ error: "profile_id and run_id are required" }, 400);
    }

    const startTime = Date.now();

    // Step 1: Generate embedding for input query
    // In production, this would call an embedding API
    const queryEmbedding = await generateQueryEmbedding(input);

    // Step 2: Retrieve relevant chunks from domain knowledge base
    const chunks = await rpc(`${domain}.match_kb_chunks`, {
      in_profile_id: profileId,
      in_query_embedding: queryEmbedding,
      in_top_k: topK,
    });

    // Step 3: Rerank chunks based on additional factors
    const rerankedChunks = await rerankChunks(chunks, input);

    // Step 4: Build context pack
    const contextPack = buildContextPack(rerankedChunks, domain);

    // Calculate average similarity
    const avgSimilarity =
      rerankedChunks.length > 0
        ? rerankedChunks.reduce((sum: number, chunk: any) => sum + (chunk.cosine_similarity || 0), 0) / rerankedChunks.length
        : 0;

    const queryTimeMs = Date.now() - startTime;

    // Log retrieval event to memory
    await restInsert(`${domain}.memory_events`, {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      event_type: "retrieval",
      event_payload: JSON.stringify({
        input_length: input.length,
        top_k: topK,
        chunks_retrieved: rerankedChunks.length,
        avg_similarity: avgSimilarity,
        query_time_ms: queryTimeMs,
      }),
      quality_signal: clamp(avgSimilarity, 0, 1),
    });

    return jsonResponse({
      run_id: runId,
      context_pack: contextPack,
      retrieval_metadata: {
        top_k: topK,
        chunks_retrieved: rerankedChunks.length,
        avg_similarity: Number(avgSimilarity.toFixed(4)),
        query_time_ms: queryTimeMs,
      },
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});

/**
 * Generate query embedding (simplified - in production use actual embedding API)
 */
async function generateQueryEmbedding(query: string): Promise<Float32Array> {
  // In production, call OpenAI embeddings API or similar
  // For now, generate a pseudo-embedding based on query hash
  const hash = simpleHash(query);
  const embedding = new Float32Array(1536);

  for (let i = 0; i < 1536; i++) {
    // Generate pseudo-random values based on hash and index
    embedding[i] = ((hash * (i + 1)) % 1000) / 1000;
  }

  // Normalize the embedding
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  for (let i = 0; i < 1536; i++) {
    embedding[i] = embedding[i] / norm;
  }

  return embedding;
}

/**
 * Simple hash function for pseudo-embedding generation
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Rerank chunks based on additional factors beyond cosine similarity
 */
async function rerankChunks(
  chunks: any[],
  query: string
): Promise<any[]> {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return [];
  }

  // Reranking formula:
  // retrieval_score = 0.50 * dense_sim + 0.20 * sparse_sim + 0.15 * recency + 0.10 * trust + 0.05 * policy_boost

  const currentTime = new Date();

  return chunks
    .map((chunk: any) => {
      const metadata = chunk.metadata || {};
      const trustLevel = metadata.trust_level || 0.6;
      const effectiveTo = new Date(metadata.effective_to || "9999-12-31");
      const effectiveFrom = new Date(metadata.effective_from || "2020-01-01");

      // Dense similarity (cosine)
      const denseSim = chunk.cosine_similarity || 0;

      // Sparse similarity (text matching - simplified)
      const sparseSim = calculateSparseSimilarity(query, chunk.chunk_text || "");

      // Recency (newer documents get higher score)
      const recency = calculateRecencyScore(effectiveFrom, currentTime);

      // Trust level
      const trust = trustLevel;

      // Policy boost (if document is tagged as policy/framework)
      const policyBoost = metadata.is_policy ? 1.0 : 0.0;

      // Calculate final retrieval score
      const retrievalScore =
        0.50 * denseSim +
        0.20 * sparseSim +
        0.15 * recency +
        0.10 * trust +
        0.05 * policyBoost;

      return {
        ...chunk,
        retrieval_score: clamp(retrievalScore, 0, 1),
        score_breakdown: {
          dense_sim: Number(denseSim.toFixed(4)),
          sparse_sim: Number(sparseSim.toFixed(4)),
          recency: Number(recency.toFixed(4)),
          trust: Number(trust.toFixed(4)),
          policy_boost: Number(policyBoost.toFixed(4)),
        },
      };
    })
    .sort((a, b) => b.retrieval_score - a.retrieval_score);
}

/**
 * Calculate sparse similarity (text overlap)
 */
function calculateSparseSimilarity(query: string, chunkText: string): number {
  const queryWords = new Set(query.toLowerCase().split(/\s+/));
  const chunkWords = new Set(chunkText.toLowerCase().split(/\s+/));

  let intersection = 0;
  for (const word of queryWords) {
    if (chunkWords.has(word)) {
      intersection++;
    }
  }

  const union = queryWords.size + chunkWords.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Calculate recency score (newer documents score higher)
 */
function calculateRecencyScore(effectiveFrom: Date, currentTime: Date): number {
  const daysDiff = (currentTime.getTime() - effectiveFrom.getTime()) / (1000 * 60 * 60 * 24);

  // Score decays over time: 1.0 for recent, decays to 0.2 for old documents
  const decayRate = 0.001; // Decay per day
  const recencyScore = Math.max(0.2, 1.0 - decayRate * daysDiff);

  return recencyScore;
}

/**
 * Build context pack from reranked chunks
 */
function buildContextPack(chunks: any[], domain: string): any {
  const documents: any[] = [];
  const frameworks: any[] = [];
  const pastCases: any[] = [];

  for (const chunk of chunks) {
    const metadata = chunk.metadata || {};
    const docType = metadata.type || "general";

    const contextItem = {
      document_id: chunk.document_id,
      chunk_id: chunk.id,
      text: chunk.chunk_text,
      similarity: Number(chunk.cosine_similarity?.toFixed(4) || 0),
      retrieval_score: Number(chunk.retrieval_score?.toFixed(4) || 0),
      metadata: metadata,
    };

    if (docType === "framework") {
      frameworks.push(contextItem);
    } else if (docType === "past_case") {
      pastCases.push(contextItem);
    } else {
      documents.push(contextItem);
    }
  }

  return {
    documents: documents.slice(0, 5), // Top 5 general documents
    frameworks: frameworks.slice(0, 3), // Top 3 frameworks
    past_cases: pastCases.slice(0, 3), // Top 3 past cases
    summary: `Retrieved ${chunks.length} relevant chunks across ${documents.length} documents, ${frameworks.length} frameworks, and ${pastCases.length} past cases.`,
  };
}

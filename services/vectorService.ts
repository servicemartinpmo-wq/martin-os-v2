import { supabase } from '../lib/supabase';
import { generateEmbedding } from './geminiService';

export async function storeDocument(content: string, metadata: any = {}) {
  if (!supabase) {
    return;
  }

  try {
    const embedding = await generateEmbedding(content);
    
    const { error } = await supabase
      .from('documents')
      .insert({
        content,
        metadata,
        embedding
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error storing document:', error);
    throw error;
  }
}

export async function searchDocuments(query: string, matchCount = 5): Promise<string> {
  if (!supabase) {
    return "";
  }

  try {
    const queryEmbedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7, // Adjust as needed
      match_count: matchCount
    });

    if (error) {
      console.error('Error searching documents:', error);
      return '';
    }

    if (!data || data.length === 0) return '';

    return data.map((doc: any) => doc.content).join('\n\n');
  } catch (error) {
    console.error('Error in vector search:', error);
    return '';
  }
}

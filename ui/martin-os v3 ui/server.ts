import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "Martin-OS", version: "1.0.0" });
  });

  // Signal Engine Endpoint
  app.post("/api/signals/detect", (req, res) => {
    const { orgData } = req.body;
    // Simulated Signal Detection Logic
    const signals = [];
    
    if (orgData?.kpis?.revenue < orgData?.targets?.revenue) {
      signals.push({ type: "performance_decline", target: "revenue", severity: "high" });
    }
    
    if (orgData?.projects?.some((p: any) => p.dueDate < new Date().toISOString() && p.status !== "complete")) {
      signals.push({ type: "missed_deadline", severity: "medium" });
    }

    res.json({ signals });
  });

  // Workflow Orchestrator Endpoint
  app.post("/api/workflows/run", (req, res) => {
    const { signal, mode } = req.body;
    // Simulated Workflow Logic
    const workflowRun = {
      id: Math.random().toString(36).substr(2, 9),
      signal,
      mode,
      status: "completed",
      outputs: {
        diagnosis: "Root cause identified: Resource bottleneck in engineering.",
        recommendations: [
          "Reallocate 2 developers from Project B to Project A",
          "Postpone non-critical maintenance tasks"
        ],
        actions: [
          { id: 1, text: "Update project timeline", assignedTo: "Project Manager" },
          { id: 2, text: "Notify stakeholders of delay", assignedTo: "Executive Assistant" }
        ]
      }
    };
    res.json(workflowRun);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Martin-OS Server running on http://localhost:${PORT}`);
  });
}

startServer();

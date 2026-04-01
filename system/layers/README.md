# Six-layer self-operating model

| Layer | Module responsibility | UI / API |
| ----- | --------------------- | -------- |
| 1 PMO | Approvals, recommendations | `PMOLayer`, Next Action, `/api/*` queue |
| 2 Tech-Ops | Monitoring, anomalies | `LiveLogs`, health widgets, cron workers |
| 3 Miiddle | Patterns, scores | `MiidleStream`, rules |
| 4 Agent | Reasoning | `src/agents`, `/api/ai` |
| 5 Execution | Validate, audit | `src/autonomy/executor` (server) |
| 6 Learning | Decision → outcome | Persistent event store (planned) |

**Do not** call `bootSystem()` at module load in client bundles. Use route loaders, server jobs, or React mount effects with explicit triggers.

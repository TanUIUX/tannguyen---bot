import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import { ensureTempUser } from "./utils/seedUser";

const app = express();
const PORT = process.env.SUNSAMA_API_PORT || 3002;

app.use(cors());
app.use(express.json());

ensureTempUser().catch(() => {
  /* seed may fail if DB not ready yet */
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Sunsama API is running" });
});

app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Sunsama API running on http://localhost:${PORT}`);
});

import "dotenv/config";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import { accountRouter } from "./routes/account.routes";
import { authRouter } from "./routes/auth.routes";
import { categoryRouter } from "./routes/category.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { transactionRouter } from "./routes/transaction.routes";

const app = express();

// FRONTEND_URL restringe CORS en producción; sin setear, permite cualquier origen (dev).
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors(frontendUrl ? { origin: frontendUrl } : undefined));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/dashboard", dashboardRouter);

// errorHandler tiene que ir al final, después de todas las rutas
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

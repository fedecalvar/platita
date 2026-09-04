import "dotenv/config";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import { accountRouter } from "./routes/account.routes";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

// TODO: categories, transactions, dashboard

// errorHandler tiene que ir al final, después de todas las rutas
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

// Health check simple para verificar que el server levanta antes de cablear
// rutas/DB. Se reemplaza (o se deja) una vez que estén los routers reales.
app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

// Acá se van a montar los routers de src/routes/ (auth, accounts, categories,
// transactions, dashboard) en los próximos pasos, una vez conectada la DB.

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

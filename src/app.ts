import express from "express";
import cors from "cors";
import pool from "./db";
import publicationsRoutes from "./routes/publications.routes";
import categoriesRoutes from "./routes/categories.routes";
import coworkingRoutes from "./routes/coworking.routes";
import purchasesRoutes from "./routes/purchases.routes";
import usersRoutes from "./routes/users.routes";
import reservationsRoutes from "./routes/reservations.routes";
import devRoutes from "./routes/dev.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", async (_, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Nexus API funcionando",
      database: "connected",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      database: "error",
    });
  }
});

app.use("/api/publications", publicationsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/coworking-spaces", coworkingRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/coworking-reservations", reservationsRoutes);
app.use("/api/dev", devRoutes);

export default app;
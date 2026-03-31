import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();

console.log("APP TS FILE LOADED");
console.log("TYPE OF eventRoutes:", typeof eventRoutes);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "APP UPDATED RIGHT NOW"
  });
});

app.get("/hello", (_req, res) => {
  res.status(200).json({
    message: "hello route works"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
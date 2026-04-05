import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";
import rateLimit from "express-rate-limit";

const app = express();

console.log("APP TS FILE LOADED");
console.log("TYPE OF eventRoutes:", typeof eventRoutes);
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: { message: "Too many requests from this IP, please try again later." }
});
app.use(globalLimiter);
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
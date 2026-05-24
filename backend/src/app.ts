import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";
import categoryRoutes from "./routes/category.routes";
import venueRoutes from "./routes/venue.routes";

const app = express();

const allowedOrigins =
  process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(globalLimiter);

app.use(express.json({ limit: "1mb" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Event Booking & Ticketing API is running",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/venues", venueRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(
  (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("UNHANDLED SERVER ERROR:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
);

export default app;
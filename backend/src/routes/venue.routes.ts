import { Router } from "express";
import { getAllVenues } from "../controllers/venue.controller";

const router = Router();

router.get("/", getAllVenues);

export default router;
import { Router } from "express";
import {
  createEvent,
  publishEvent,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getUserEvents,
  getEventById
} from "../controllers/event.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { createEventSchema } from "../validators/event.validator";

const router = Router();

router.get("/test", (_req, res) => {
  res.status(200).json({
    message: "event routes are working"
  });
});

router.get("/", getAllEvents);
router.get("/:eventId", getEventById);
router.get("/my",authenticate, getUserEvents);

router.post(
  "/",
  authenticate,
  authorize("ORGANISER"),
  validate(createEventSchema),
  createEvent
);

router.patch(
  "/:eventId/publish",
  authenticate,
  authorize("ORGANISER"),
  publishEvent
);

router.patch(
  "/:eventId",
  authenticate,
  authorize("ORGANISER"),
  validate(createEventSchema), 
  updateEvent
);

router.delete(
  "/:eventId",
  authenticate,
  authorize("ORGANISER"),
  deleteEvent
);


export default router;
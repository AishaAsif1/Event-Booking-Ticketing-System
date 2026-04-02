import { Router } from "express";
import { createBooking, getMyBookings, cancelBooking } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { createBookingSchema } from "../validators/booking.validator";

const router = Router();

router.get(
  "/my",
  authenticate,
  authorize("ATTENDEE"),
  getMyBookings
);

router.post(
  "/",
  authenticate,
  authorize("ATTENDEE"),
  validate(createBookingSchema),
  createBooking
);

router.patch(
  "/:eventId/cancel",
  authenticate,
  authorize("ATTENDEE"),
  cancelBooking
);

export default router;
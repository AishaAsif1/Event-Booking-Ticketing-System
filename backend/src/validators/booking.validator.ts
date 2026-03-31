import { z } from "zod";

export const createBookingSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1")
});
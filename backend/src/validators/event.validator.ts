import { z } from "zod";
import { EventStatus } from "@prisma/client";

export const createEventSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),

    eventDate: z
        .string()
        .datetime(),

    capacity: z
        .number()
        .min(1, "Capacity must be at least 1"),

    venueId: z
        .string(),

    categoryId: z
        .string()
});
export const eventQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.nativeEnum(EventStatus).optional(),
  // Added Sorting Fields
  sortBy: z.enum(["eventDate", "title", "createdAt"]).optional().default("eventDate"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});
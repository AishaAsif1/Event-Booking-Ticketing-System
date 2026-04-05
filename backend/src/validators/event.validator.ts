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
  // Transform string numbers from URL into actual numbers, default to 1 and 10
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  
  // Optional search string
  search: z.string().optional(),
  
  // Optional filters
  categoryId: z.string().uuid().optional(),
  venueId: z.string().uuid().optional(),
  status: z.nativeEnum(EventStatus).optional(),
});
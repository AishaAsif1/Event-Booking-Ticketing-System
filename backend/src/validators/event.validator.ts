import { z } from "zod";

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
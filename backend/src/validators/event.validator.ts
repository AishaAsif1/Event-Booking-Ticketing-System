//source: ZOD Documentation - https://zod.dev/
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

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .optional()
    .default(0),

  venueId: z
    .string(),

  categoryId: z
    .string()
});

export const eventQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val) : 1;
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val) : 10;
      return Number.isNaN(parsed) || parsed < 1 ? 10 : parsed;
    }),

  search: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      return val.trim();
    }),

  categoryId: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "" || val === "ALL") return undefined;
      return val;
    }),

  status: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "" || val === "ALL") return undefined;
      if (val === "DRAFT" || val === "PUBLISHED" || val === "CANCELLED") {
        return val;
      }
      return undefined;
    }),

  sortBy: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "eventDate" || val === "title" || val === "createdAt") {
        return val;
      }
      return "eventDate";
    }),

  order: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "asc" || val === "desc") return val;
      return "asc";
    }),
});
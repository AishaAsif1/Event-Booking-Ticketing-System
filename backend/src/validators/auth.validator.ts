import { z } from "zod";
// Adapted from: ChatGPT response to the question "Give me a list of a few weak passwords"
const weakPasswords = [
    "password",
    "password123",
    "12345678",
    "123456789",
    "qwerty123",
    "admin123",
    "welcome123",
    "letmein123",
    "eventbooking123",
    "wdproject123"
];

const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(64, "Password must be at most 64 characters")
    .refine((value) => !weakPasswords.includes(value.toLowerCase()), {
        message: "This password is too common. Choose a stronger password."
    });

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name is too long"),

    email: z
        .string()
        .email("Invalid email format")
        .max(255, "Email is too long")
        .transform((email) => email.toLowerCase().trim()),

    password: passwordSchema,

    role: z.enum(["ORGANISER", "ATTENDEE"])
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email format")
        .max(255, "Email is too long")
        .transform((email) => email.toLowerCase().trim()),

    password: z
        .string()
        .min(1, "Password is required")
});
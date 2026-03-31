import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = schema.parse(req.body);
            req.body = parsedData;
            next();
        } catch (error: any) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.issues || error.errors
            });
        }
    };
};
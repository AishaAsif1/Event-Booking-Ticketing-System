import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

export const authorize = (...allowedRoles: ("ORGANISER" | "ATTENDEE")[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: You do not have permission to access this resource"
            });
        }

        next();
    };
};
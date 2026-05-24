import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getAllVenues = async (_req: Request, res: Response) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      message: "Venues fetched successfully",
      venues,
    });
  } catch (error) {
    console.error("GET VENUES ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching venues",
    });
  }
};
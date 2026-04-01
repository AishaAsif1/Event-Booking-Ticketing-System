import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";



export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        eventDate: "asc"
      }
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("GET ALL EVENTS ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching events"
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("GET EVENT BY ID ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching the event"
    });
  }
};

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { title, description, eventDate, capacity, venueId, categoryId } =
      req.body;

    const organiserId = req.user!.userId;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        capacity,
        venueId,
        categoryId,
        organiserId
      }
    });

    return res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while creating the event"
    });
  }
};

export const publishEvent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    const organiserId = req.user!.userId;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (existingEvent.organiserId !== organiserId) {
      return res.status(403).json({
        message: "You can only publish your own events"
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: "PUBLISHED"
      }
    });

    return res.status(200).json({
      message: "Event published successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("PUBLISH EVENT ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while publishing the event"
    });
  }
};

export const updateEvent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    const organiserId = req.user!.userId;
    const { title, description, eventDate, capacity, venueId, categoryId } = req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (existingEvent.organiserId !== organiserId) {
      return res.status(403).json({
        message: "You can only update your own events"
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        capacity,
        venueId,
        categoryId
      }
    });

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while updating the event"
    });
  }
};

export const deleteEvent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    const organiserId = req.user!.userId;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (existingEvent.organiserId !== organiserId) {
      return res.status(403).json({
        message: "You can only delete your own events"
      });
    }

    await prisma.event.delete({
      where: { id: eventId }
    });

    return res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while deleting the event"
    });
  }
};
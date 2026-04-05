import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";
import { eventQuerySchema } from "../validators/event.validator"; //

//source Chatgpt - while writing code we were faced with some errors in creating events and we used chat gpt to fix the errors 

const getSingleParam = (param: string | string[] | undefined): string | undefined =>
  Array.isArray(param) ? param[0] : param;

export const getAllEvents = async (req: Request, res: Response) => {
  try {
// 1. Validate and extract query parameters
const queryParams = eventQuerySchema.parse(req.query);
const { page, limit, search, categoryId, status, sortBy, order } = queryParams;
const venueId = getSingleParam(req.query.venueId as string | string[] | undefined);
const skip = (page - 1) * limit; // Calculate how many records to skip
// 2. Build the dynamic 'where' filter
const where: any = {};
if (search) {
  where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } }
  ];
}

if (categoryId) where.categoryId = categoryId;
if (venueId) where.venueId = venueId;
if (status) where.status = status;

// 3. Execute count and findMany in parallel for efficiency
const [events, total] = await Promise.all([
  prisma.event.findMany({
    where,
    take: limit,
    skip,
    orderBy: { [sortBy!]: order },
    include: { category: true, venue: true },
  }),
  prisma.event.count({ where })
]);

    // 4. Return data with pagination metadata
    return res.status(200).json({
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("GET ALL EVENTS ERROR:", error);
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: error.issues || error.errors
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = getSingleParam(req.params.eventId);

    if (!eventId) {
      return res.status(400).json({
        message: "Invalid event id"
      });
    }

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
    const eventId = getSingleParam(req.params.eventId);
    const organiserId = req.user!.userId;

    if (!eventId) {
      return res.status(400).json({
        message: "Invalid event id"
      });
    }

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
    const eventId = getSingleParam(req.params.eventId);
    const organiserId = req.user!.userId;
    const { title, description, eventDate, capacity, venueId, categoryId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "Invalid event id"
      });
    }

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
    const eventId = getSingleParam(req.params.eventId);
    const organiserId = req.user!.userId;

    if (!eventId) {
      return res.status(400).json({
        message: "Invalid event id"
      });
    }

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

export const getUserEvents = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const organiserId = req.user!.userId;

    const events = await prisma.event.findMany({
      where: { organiserId }
    });

    return res.status(200).json({
      message: "Organizer events fetched successfully",
      events
    });
  } catch (error) {
    console.error("GET MY EVENTS ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching your events"
    });
  }
};

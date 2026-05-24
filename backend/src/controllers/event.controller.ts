import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";

// source ChatGPT - while writing code we were faced with some errors in creating events and we used ChatGPT to fix the errors

const getSingleParam = (
  param: string | string[] | undefined
): string | undefined => {
  return Array.isArray(param) ? param[0] : param;
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const rawPage = getSingleParam(req.query.page as string | string[] | undefined);
    const rawLimit = getSingleParam(req.query.limit as string | string[] | undefined);
    const rawSearch = getSingleParam(req.query.search as string | string[] | undefined);
    const rawCategoryId = getSingleParam(
      req.query.categoryId as string | string[] | undefined
    );
    const rawVenueId = getSingleParam(
      req.query.venueId as string | string[] | undefined
    );
    const rawStatus = getSingleParam(
      req.query.status as string | string[] | undefined
    );
    const rawSortBy = getSingleParam(
      req.query.sortBy as string | string[] | undefined
    );
    const rawOrder = getSingleParam(
      req.query.order as string | string[] | undefined
    );

    const parsedPage = rawPage !== undefined ? Number(rawPage) : NaN;
    const parsedLimit = rawLimit !== undefined ? Number(rawLimit) : NaN;

    if (rawPage !== undefined && (Number.isNaN(parsedPage) || parsedPage < 1 || !Number.isInteger(parsedPage))) {
      return res.status(400).json({ message: "Invalid query parameter: page must be a positive integer" });
    }
    if (rawLimit !== undefined && (Number.isNaN(parsedLimit) || parsedLimit < 1 || !Number.isInteger(parsedLimit))) {
      return res.status(400).json({ message: "Invalid query parameter: limit must be a positive integer" });
    }

    const page = Number.isNaN(parsedPage) ? 1 : parsedPage;
    const limit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;

    const search =
      typeof rawSearch === "string" && rawSearch.trim() !== ""
        ? rawSearch.trim()
        : undefined;

    const categoryId =
      typeof rawCategoryId === "string" &&
      rawCategoryId.trim() !== "" &&
      rawCategoryId !== "ALL" &&
      rawCategoryId !== "All"
        ? rawCategoryId
        : undefined;

    const venueId =
      typeof rawVenueId === "string" &&
      rawVenueId.trim() !== "" &&
      rawVenueId !== "ALL" &&
      rawVenueId !== "All"
        ? rawVenueId
        : undefined;

    const status =
      rawStatus === "DRAFT" ||
      rawStatus === "PUBLISHED" ||
      rawStatus === "CANCELLED"
        ? rawStatus
        : undefined;

    const sortBy =
      rawSortBy === "eventDate" ||
      rawSortBy === "title" ||
      rawSortBy === "createdAt"
        ? rawSortBy
        : "eventDate";

    const order = rawOrder === "desc" ? "desc" : "asc";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (venueId) {
      where.venueId = venueId;
    }

    if (status) {
      where.status = status;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          category: true,
          venue: true,
        },
      }),
      prisma.event.count({
        where,
      }),
    ]);

    return res.status(200).json({
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET ALL EVENTS ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching events",
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = getSingleParam(req.params.eventId);

    if (!eventId) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        category: true,
        venue: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("GET EVENT BY ID ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching the event",
    });
  }
};

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      eventDate,
      capacity,
      price,
      venueId,
      categoryId,
    } = req.body;

    const organiserId = req.user!.userId;

    const [venue, category] = await Promise.all([
      prisma.venue.findUnique({ where: { id: venueId } }),
      prisma.category.findUnique({ where: { id: categoryId } }),
    ]);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        capacity,
        price: price ?? 0,
        venueId,
        categoryId,
        organiserId,
      },
      include: {
        category: true,
        venue: true,
      },
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the event",
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
        message: "Invalid event id",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (existingEvent.organiserId !== organiserId) {
      return res.status(403).json({
        message: "You can only publish your own events",
      });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        status: "PUBLISHED",
      },
      include: {
        category: true,
        venue: true,
      },
    });

    return res.status(200).json({
      message: "Event published successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("PUBLISH EVENT ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while publishing the event",
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

    const {
      title,
      description,
      eventDate,
      capacity,
      price,
      venueId,
      categoryId,
    } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (existingEvent.organiserId !== organiserId) {
      return res.status(403).json({
        message: "You can only update your own events",
      });
    }

    const [venue, category] = await Promise.all([
      prisma.venue.findUnique({ where: { id: venueId } }),
      prisma.category.findUnique({ where: { id: categoryId } }),
    ]);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        capacity,
        price: price ?? 0,
        venueId,
        categoryId,
      },
      include: {
        category: true,
        venue: true,
      },
    });

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while updating the event",
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
        message: "Invalid event id",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (existingEvent.organiserId !== organiserId) {
      return res.status(403).json({
        message: "You can only delete your own events",
      });
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while deleting the event",
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
      where: {
        organiserId,
      },
      include: {
        category: true,
        venue: true,
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: {
            bookedAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const eventsWithStats = events.map((event) => {
      const confirmedBookings = event.bookings.filter(
        (booking) => booking.bookingStatus === "CONFIRMED"
      );

      const ticketsSold = confirmedBookings.reduce(
        (sum, booking) => sum + booking.quantity,
        0
      );

      return {
        ...event,
        ticketsSold,
        attendees: confirmedBookings.map((booking) => ({
          bookingId: booking.id,
          attendeeId: booking.user.id,
          fullName: booking.user.fullName,
          email: booking.user.email,
          quantity: booking.quantity,
          bookedAt: booking.bookedAt,
          bookingStatus: booking.bookingStatus,
        })),
      };
    });

    return res.status(200).json({
      message: "Organizer events fetched successfully",
      events: eventsWithStats,
    });
  } catch (error) {
    console.error("GET MY EVENTS ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching your events",
    });
  }
};
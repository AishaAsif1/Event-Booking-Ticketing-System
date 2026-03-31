import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth";

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user!.userId;

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required"
      });
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a number greater than 0"
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        bookings: {
          where: {
            bookingStatus: "CONFIRMED"
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.status !== "PUBLISHED") {
      return res.status(400).json({
        message: "Only published events can be booked"
      });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    const totalBooked = event.bookings.reduce((sum, booking) => {
      return sum + booking.quantity;
    }, 0);

    const currentUserBooked =
      existingBooking && existingBooking.bookingStatus === "CONFIRMED"
        ? existingBooking.quantity
        : 0;

    const newTotalBooked = totalBooked - currentUserBooked + quantity;

    if (newTotalBooked > event.capacity) {
      return res.status(400).json({
        message: "Booking exceeds available event capacity"
      });
    }

    let booking;

    if (existingBooking) {
      booking = await prisma.booking.update({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        },
        data: {
          quantity,
          bookingStatus: "CONFIRMED"
        }
      });

      return res.status(200).json({
        message: "Booking updated successfully",
        booking
      });
    }

    booking = await prisma.booking.create({
      data: {
        userId,
        eventId,
        quantity,
        bookingStatus: "CONFIRMED"
      }
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the booking"
    });
  }
};

export const getMyBookings = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        userId
      },
      include: {
        event: {
          include: {
            venue: true,
            category: true
          }
        }
      },
      orderBy: {
        bookedAt: "desc"
      }
    });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings
    });
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching bookings"
    });
  }
};
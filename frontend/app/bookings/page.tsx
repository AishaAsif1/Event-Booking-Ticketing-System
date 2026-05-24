"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookingCard from "../../components/BookingCard";
import Button from "../../components/ui/Button";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

type ApiBooking = {
  id: string;
  eventId: string;
  quantity: number;
  bookingStatus: "CONFIRMED" | "CANCELLED";
  bookedAt: string;
  event: {
    title: string;
    eventDate: string;
    venue?: { name: string } | null;
  };
};

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingEventId, setCancellingEventId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setFeedbackMessage("");

    try {
      const res = await apiFetch("/bookings/my");
      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to load bookings.");
        setBookings([]);
        return;
      }

      setBookings(data.bookings ?? []);
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ATTENDEE") {
      router.push("/events");
      return;
    }

    fetchBookings();
  }, [user, authLoading, router, fetchBookings]);

  async function handleCancelBooking(eventId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingEventId(eventId);
    setFeedbackMessage("");

    try {
      const res = await apiFetch(`/bookings/${eventId}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to cancel booking.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Booking cancelled successfully.");
      await fetchBookings();
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setCancellingEventId("");
    }
  }

  const activeBookings = bookings.filter(
    (booking) => booking.bookingStatus === "CONFIRMED"
  );

  const totalTickets = activeBookings.reduce(
    (total, booking) => total + booking.quantity,
    0
  );

  if (authLoading || (!user && !feedbackMessage)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            My Bookings
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            View your booked events, ticket quantities, and booking status in
            one place.
          </p>

          <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">
                {activeBookings.length}
              </p>
              <p className="text-sm font-medium text-gray-600">
                Active Bookings
              </p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">
                {totalTickets}
              </p>
              <p className="text-sm font-medium text-gray-600">
                Active Tickets
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/events">
              <Button>Browse Events</Button>
            </Link>

            <Link href="/">
              <Button variant="secondary">Back Home</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        {feedbackMessage && (
          <div className="mb-6">
            <AlertMessage type={feedbackType} message={feedbackMessage} />
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl bg-white p-10 shadow-md">
            <LoadingSpinner />
            <p className="mt-4 text-center text-gray-600">
              Loading your bookings...
            </p>
          </div>
        )}

        {!isLoading && bookings.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold text-gray-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              You have not booked any events yet. Browse available events and
              reserve your first ticket.
            </p>

            <div className="mt-6">
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                eventId={booking.eventId}
                eventTitle={booking.event.title}
                venue={booking.event.venue?.name ?? "Unknown Venue"}
                date={booking.event.eventDate}
                quantity={booking.quantity}
                status={booking.bookingStatus}
                isCancelling={cancellingEventId === booking.eventId}
                onCancel={() => handleCancelBooking(booking.eventId)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Reference: nextjs.org/docs/app/building-your-application/routing/middleware
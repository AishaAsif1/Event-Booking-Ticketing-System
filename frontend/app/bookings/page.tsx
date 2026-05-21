
"use client";

import { useEffect, useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchBookings() {
      try {
        const res = await apiFetch("/bookings/my");
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.message || "Failed to load bookings.");
          return;
        }

        setBookings(data.bookings ?? []);
      } catch {
        setErrorMessage("Could not reach the server. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [user, authLoading, router]);

  const totalTickets = bookings.reduce(
    (total, booking) => total + booking.quantity,
    0
  );

  if (authLoading || (!user && !errorMessage)) {
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
                {bookings.length}
              </p>
              <p className="text-sm font-medium text-gray-600">Bookings</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">
                {totalTickets}
              </p>
              <p className="text-sm font-medium text-gray-600">Tickets</p>
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
        {isLoading && (
          <div className="rounded-3xl bg-white p-10 shadow-md">
            <LoadingSpinner />
            <p className="mt-4 text-center text-gray-600">
              Loading your bookings...
            </p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <AlertMessage type="error" message={errorMessage} />
        )}

        {!isLoading && !errorMessage && bookings.length === 0 && (
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

        {!isLoading && !errorMessage && bookings.length > 0 && (
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
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
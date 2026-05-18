"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookingCard from "../../components/BookingCard";
import Button from "../../components/ui/Button";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { bookings } from "../../data/bookings";

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              My Bookings
            </h1>

            <p className="mt-2 text-gray-600">
              View your booked events and ticket details.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/events">
              <Button>Browse Events</Button>
            </Link>

            <Link href="/">
              <Button variant="secondary">Back Home</Button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl bg-white p-8 shadow-md">
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
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <h2 className="text-xl font-bold text-gray-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-600">
              Browse events and book your first ticket.
            </p>

            <div className="mt-6">
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && !errorMessage && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                eventTitle={booking.eventTitle}
                venue={booking.venue}
                date={booking.date}
                quantity={booking.quantity}
                totalPrice={booking.totalPrice}
                status={booking.status}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
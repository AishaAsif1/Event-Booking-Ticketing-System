"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "../../components/EventCard";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { apiFetch } from "../../lib/api";

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  category: { id: string; name: string };
  venue: { id: string; name: string };
};

export default function EventsPage() {
  const { user } = useAuth();
  const isOrganiser = user?.role === "ORGANISER";

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await apiFetch("/events?limit=50");
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.message || "Failed to load events.");
          return;
        }

        setEvents(data.data ?? []);
      } catch {
        setErrorMessage("Could not reach the server. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Browse Events
            </h1>
            <p className="mt-2 text-gray-600">
              Explore available events and book your tickets.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {isOrganiser && (
              <Link href="/create-event">
                <Button>Create Event</Button>
              </Link>
            )}

            <Link href="/">
              <Button variant="secondary">Back Home</Button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <LoadingSpinner />
            <p className="mt-4 text-center text-gray-600">Loading events...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <AlertMessage type="error" message={errorMessage} />
        )}

        {!isLoading && !errorMessage && events.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <h2 className="text-xl font-bold text-gray-900">
              No events available
            </h2>
            <p className="mt-2 text-gray-600">
              Please check again later or create a new event.
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                category={event.category?.name ?? "Uncategorised"}
                venue={event.venue?.name ?? "Unknown Venue"}
                date={event.eventDate}
                capacity={event.capacity}
                status={event.status}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

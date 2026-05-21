"use client";

import { useEffect, useMemo, useState } from "react";
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
  category?: { id: string; name: string } | null;
  venue?: { id: string; name: string } | null;
  price?: number;
};

export default function EventsPage() {
  const { user } = useAuth();
  const isOrganiser = user?.role === "ORGANISER";

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categories = useMemo(() => {
    const uniqueCategories = events
      .map((event) => event.category?.name)
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(uniqueCategories))];
  }, [events]);

  const filteredEvents = events.filter((event) => {
    const categoryName = event.category?.name ?? "Uncategorised";
    const venueName = event.venue?.name ?? "Unknown Venue";

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Explore Events
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Search events, discover new experiences, and book tickets for the
            moments you do not want to miss.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <input
              type="text"
              placeholder="Search events, artists, or venues..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {categories.length > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {isLoading && (
          <div className="rounded-3xl bg-white p-10 shadow-md">
            <LoadingSpinner />
            <p className="mt-4 text-center text-gray-600">Loading events...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <AlertMessage type="error" message={errorMessage} />
        )}

        {!isLoading && !errorMessage && filteredEvents.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold text-gray-900">
              No events found
            </h2>

            <p className="mt-3 text-gray-600">
              Try searching with another keyword or category.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!isLoading && !errorMessage && filteredEvents.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Showing {filteredEvents.length} event
                {filteredEvents.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
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
                  price={event.price}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
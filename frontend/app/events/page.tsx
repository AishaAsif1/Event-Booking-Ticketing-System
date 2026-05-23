"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "../../components/EventCard";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { apiFetch } from "../../lib/api";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  status: EventStatus;
  category?: { id: string; name: string } | null;
  venue?: { id: string; name: string } | null;
  price?: number;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const EVENTS_PER_PAGE = 6;

export default function EventsPage() {
  const { user } = useAuth();
  const isOrganiser = user?.role === "ORGANISER";

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: EVENTS_PER_PAGE,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | EventStatus>(
    "All"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(EVENTS_PER_PAGE),
          sortBy: "eventDate",
          order: "asc",
        });

        if (appliedSearch) {
          query.set("search", appliedSearch);
        }

        if (selectedStatus !== "All") {
          query.set("status", selectedStatus);
        }

        const res = await apiFetch(`/events?${query.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.message || "Failed to load events.");
          setEvents([]);
          return;
        }

        setEvents(data.data ?? []);
        setMeta(
          data.meta ?? {
            total: 0,
            page,
            limit: EVENTS_PER_PAGE,
            totalPages: 1,
          }
        );
      } catch {
        setErrorMessage("Could not reach the server. Is the backend running?");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [page, appliedSearch, selectedStatus]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchTerm.trim());
  }

  function clearFilters() {
    setSearchTerm("");
    setAppliedSearch("");
    setSelectedStatus("All");
    setPage(1);
  }

  const hasPreviousPage = page > 1;
  const hasNextPage = page < meta.totalPages;

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

          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <Button type="submit">Search</Button>
          </form>

          <div className="mx-auto mt-5 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <select
              value={selectedStatus}
              onChange={(event) => {
                setSelectedStatus(event.target.value as "All" | EventStatus);
                setPage(1);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {(appliedSearch || selectedStatus !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>

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

        {!isLoading && !errorMessage && events.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold text-gray-900">
              No events found
            </h2>

            <p className="mt-3 text-gray-600">
              Try searching with another keyword or changing the status filter.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!isLoading && !errorMessage && events.length > 0 && (
          <>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-gray-600">
                Showing page {meta.page} of {meta.totalPages} · {meta.total}{" "}
                total event{meta.total === 1 ? "" : "s"}
              </p>

              <p className="text-sm font-medium text-gray-500">
                {appliedSearch && <>Search: “{appliedSearch}”</>}
                {appliedSearch && selectedStatus !== "All" && " · "}
                {selectedStatus !== "All" && <>Status: {selectedStatus}</>}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  price={event.price}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-md sm:flex-row">
              <Button
                variant="secondary"
                disabled={!hasPreviousPage || isLoading}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Previous
              </Button>

              <p className="text-sm font-semibold text-gray-600">
                Page {meta.page} of {meta.totalPages}
              </p>

              <Button
                disabled={!hasNextPage || isLoading}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
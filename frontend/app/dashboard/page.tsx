"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

type Attendee = {
  bookingId: string;
  attendeeId: string;
  fullName: string;
  email: string;
  quantity: number;
  bookedAt: string;
  bookingStatus: "CONFIRMED" | "CANCELLED";
};

type OrganiserEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  status: EventStatus;
  ticketsSold?: number;
  attendees?: Attendee[];
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState<OrganiserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ORGANISER") {
      router.push("/events");
      return;
    }

    fetchMyEvents();
  }, [user, authLoading, router]);

  async function fetchMyEvents() {
    setIsLoading(true);
    setFeedbackMessage("");

    try {
      const res = await apiFetch("/events/my");
      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to load dashboard events.");
        setEvents([]);
        return;
      }

      setEvents(data.events ?? []);
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function publishEvent(eventId: string) {
    setActionLoadingId(eventId);
    setFeedbackMessage("");

    try {
      const res = await apiFetch(`/events/${eventId}/publish`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to publish event.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Event published successfully.");
      await fetchMyEvents();
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setActionLoadingId("");
    }
  }

  async function deleteEvent(eventId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setActionLoadingId(eventId);
    setFeedbackMessage("");

    try {
      const res = await apiFetch(`/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to delete event.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Event deleted successfully.");
      await fetchMyEvents();
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setActionLoadingId("");
    }
  }

  const stats = useMemo(() => {
    const total = events.length;
    const published = events.filter((event) => event.status === "PUBLISHED").length;
    const draft = events.filter((event) => event.status === "DRAFT").length;
    const cancelled = events.filter((event) => event.status === "CANCELLED").length;
    const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
    const totalTicketsSold = events.reduce(
      (sum, event) => sum + (event.ticketsSold ?? 0),
      0
    );

    return {
      total,
      published,
      draft,
      cancelled,
      totalCapacity,
      totalTicketsSold,
    };
  }, [events]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                Organiser Panel
              </p>

              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
                Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                Manage your events, publish drafts, edit event details, track
                tickets sold, and view attendee lists from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/create-event">
                <Button>Create Event</Button>
              </Link>

              <Link href="/events">
                <Button variant="secondary">View Events</Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-green-700">
                {stats.published}
              </p>
              <p className="text-sm font-medium text-gray-600">Published</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-yellow-700">
                {stats.draft}
              </p>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-red-700">
                {stats.cancelled}
              </p>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-blue-700">
                {stats.totalTicketsSold}
              </p>
              <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">
                {stats.totalCapacity}
              </p>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {feedbackMessage && (
          <div className="mb-6">
            <AlertMessage type={feedbackType} message={feedbackMessage} />
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl bg-white p-10 shadow-md">
            <LoadingSpinner />
            <p className="mt-4 text-center text-gray-600">
              Loading dashboard...
            </p>
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold text-gray-900">
              No events created yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              Create your first event and manage it from this dashboard.
            </p>

            <div className="mt-6">
              <Link href="/create-event">
                <Button>Create Event</Button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-md">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-2xl font-extrabold text-gray-900">
                My Events
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Edit events, publish drafts, delete events, view tickets sold,
                and check attendee lists.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {events.map((event) => {
                const formattedDate = new Date(event.eventDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                );

                const statusClasses = {
                  PUBLISHED: "bg-green-100 text-green-700",
                  DRAFT: "bg-yellow-100 text-yellow-700",
                  CANCELLED: "bg-red-100 text-red-700",
                };

                const attendees = event.attendees ?? [];
                const ticketsSold = event.ticketsSold ?? 0;

                return (
                  <div key={event.id} className="p-6">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-extrabold text-gray-900">
                            {event.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[event.status]}`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                          {event.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>Date: {formattedDate}</span>
                          <span>Capacity: {event.capacity}</span>
                          <span>Tickets Sold: {ticketsSold}</span>
                          <span>ID: {event.id}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link href={`/edit-event/${event.id}`}>
                          <Button variant="secondary">Edit</Button>
                        </Link>

                        {event.status !== "PUBLISHED" && (
                          <Button
                            disabled={actionLoadingId === event.id}
                            onClick={() => publishEvent(event.id)}
                          >
                            {actionLoadingId === event.id ? (
                              <LoadingSpinner />
                            ) : (
                              "Publish"
                            )}
                          </Button>
                        )}

                        <Button
                          variant="secondary"
                          disabled={actionLoadingId === event.id}
                          onClick={() => deleteEvent(event.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-gray-700">
                          Attendee List
                        </h4>

                        <p className="text-sm font-semibold text-blue-700">
                          {ticketsSold} ticket{ticketsSold === 1 ? "" : "s"} sold
                        </p>
                      </div>

                      {attendees.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                          No attendees have booked this event yet.
                        </p>
                      ) : (
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full min-w-[650px] text-left text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th className="py-3 pr-4">Attendee</th>
                                <th className="py-3 pr-4">Email</th>
                                <th className="py-3 pr-4">Tickets</th>
                                <th className="py-3 pr-4">Booked At</th>
                                <th className="py-3 pr-4">Status</th>
                              </tr>
                            </thead>

                            <tbody>
                              {attendees.map((attendee) => {
                                const bookedDate = new Date(
                                  attendee.bookedAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                });

                                return (
                                  <tr
                                    key={attendee.bookingId}
                                    className="border-b border-gray-100 last:border-0"
                                  >
                                    <td className="py-3 pr-4 font-semibold text-gray-900">
                                      {attendee.fullName}
                                    </td>
                                    <td className="py-3 pr-4 text-gray-600">
                                      {attendee.email}
                                    </td>
                                    <td className="py-3 pr-4 text-gray-600">
                                      {attendee.quantity}
                                    </td>
                                    <td className="py-3 pr-4 text-gray-600">
                                      {bookedDate}
                                    </td>
                                    <td className="py-3 pr-4">
                                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                        {attendee.bookingStatus}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
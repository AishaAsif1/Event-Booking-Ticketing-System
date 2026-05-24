"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import AlertMessage from "../../../components/ui/AlertMessage";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/api";

type EventForm = {
  title: string;
  description: string;
  eventDate: string;
  capacity: string;
  price: string;
  venueId: string;
  categoryId: string;
};

type FormErrors = Partial<Record<keyof EventForm, string>>;

type EventResponse = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  price?: number;
  venueId: string;
  categoryId: string;
  organiserId?: string;
  status?: string;
};

const initialForm: EventForm = {
  title: "",
  description: "",
  eventDate: "",
  capacity: "",
  price: "",
  venueId: "",
  categoryId: "",
};

function formatDateForInput(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const [form, setForm] = useState<EventForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (!eventId) {
      setFeedbackType("error");
      setFeedbackMessage("Invalid event id.");
      setIsLoadingEvent(false);
      return;
    }

    fetchEvent();
  }, [user, authLoading, eventId, router]);

  async function fetchEvent() {
    setIsLoadingEvent(true);
    setFeedbackMessage("");

    try {
      const res = await apiFetch(`/events/${eventId}`);
      const data: EventResponse | { message?: string } = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(
          "message" in data && data.message
            ? data.message
            : "Failed to load event."
        );
        return;
      }

      const event = data as EventResponse;

      setForm({
        title: event.title ?? "",
        description: event.description ?? "",
        eventDate: formatDateForInput(event.eventDate),
        capacity: String(event.capacity ?? ""),
        price: String(event.price ?? 0),
        venueId: event.venueId ?? "",
        categoryId: event.categoryId ?? "",
      });
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setIsLoadingEvent(false);
    }
  }

  function updateField(field: keyof EventForm, value: string) {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const capacityNumber = Number(form.capacity);
    const priceNumber = Number(form.price);
    const selectedDate = new Date(form.eventDate);
    const now = new Date();

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    }

    if (!form.categoryId.trim()) {
      nextErrors.categoryId = "Category ID is required.";
    }

    if (!form.venueId.trim()) {
      nextErrors.venueId = "Venue ID is required.";
    }

    if (!form.eventDate) {
      nextErrors.eventDate = "Event date is required.";
    } else if (Number.isNaN(selectedDate.getTime())) {
      nextErrors.eventDate = "Please enter a valid date.";
    } else if (selectedDate <= now) {
      nextErrors.eventDate = "Event date must be in the future.";
    }

    if (!form.capacity.trim()) {
      nextErrors.capacity = "Capacity is required.";
    } else if (Number.isNaN(capacityNumber)) {
      nextErrors.capacity = "Capacity must be a number.";
    } else if (capacityNumber < 1) {
      nextErrors.capacity = "Capacity must be at least 1.";
    }

    if (!form.price.trim()) {
      nextErrors.price = "Price is required.";
    } else if (Number.isNaN(priceNumber)) {
      nextErrors.price = "Price must be a number.";
    } else if (priceNumber < 0) {
      nextErrors.price = "Price cannot be negative.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      setFeedbackType("error");
      setFeedbackMessage("Please fix the errors before saving changes.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventDate: new Date(form.eventDate).toISOString(),
        capacity: Number(form.capacity),
        price: Number(form.price),
        venueId: form.venueId.trim(),
        categoryId: form.categoryId.trim(),
      };

      const res = await apiFetch(`/events/${eventId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to update event.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Event updated successfully. Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || isLoadingEvent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-3xl bg-white p-10 text-center shadow-md">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Organiser Panel
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Edit Event
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Update your event details, ticket price, and capacity.
          </p>

          <div className="mt-6">
            <Link href="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {feedbackMessage && (
          <div className="mb-6">
            <AlertMessage type={feedbackType} message={feedbackMessage} />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-md"
        >
          <div className="grid gap-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Event Title
              </label>

              <input
                id="title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter event title"
              />

              {errors.title && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={5}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Describe your event"
              />

              {errors.description && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Event Date
                </label>

                <input
                  id="eventDate"
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(event) =>
                    updateField("eventDate", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {errors.eventDate && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.eventDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Capacity
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) =>
                    updateField("capacity", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter capacity"
                />

                {errors.capacity && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Ticket Price
              </label>

              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter ticket price"
              />

              {errors.price && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.price}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="venueId"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Venue ID
                </label>

                <input
                  id="venueId"
                  value={form.venueId}
                  onChange={(event) => updateField("venueId", event.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter venue ID"
                />

                {errors.venueId && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.venueId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Category ID
                </label>

                <input
                  id="categoryId"
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField("categoryId", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter category ID"
                />

                {errors.categoryId && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner /> : "Save Changes"}
              </Button>

              <Link href="/dashboard">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
// Reference: nextjs.org/docs/app/building-your-application/routing/dynamic-routes
// Used ChatGPT and Gemini for assistance in writing this file
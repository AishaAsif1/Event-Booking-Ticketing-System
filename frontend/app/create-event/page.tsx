"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

type Option = { id: string; name: string };

type EventFormData = {
  title: string;
  description: string;
  categoryId: string;
  venueId: string;
  date: string;
  capacity: string;
};

type EventErrors = {
  title?: string;
  description?: string;
  categoryId?: string;
  venueId?: string;
  date?: string;
  capacity?: string;
};

const today = new Date().toISOString().split("T")[0];

export default function CreateEventPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [venues, setVenues] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    categoryId: "",
    venueId: "",
    date: "",
    capacity: "",
  });

  const [errors, setErrors] = useState<EventErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "ORGANISER") {
      router.push("/events");
    }
  }, [user, authLoading, router]);

  // Derive venue/category options from existing events
  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await apiFetch("/events?limit=100");
        const data = await res.json();
        const events: Array<{
          venue: { id: string; name: string };
          category: { id: string; name: string };
        }> = data.data ?? [];

        const venueMap = new Map<string, string>();
        const categoryMap = new Map<string, string>();

        for (const ev of events) {
          if (ev.venue) venueMap.set(ev.venue.id, ev.venue.name);
          if (ev.category) categoryMap.set(ev.category.id, ev.category.name);
        }

        setVenues(Array.from(venueMap, ([id, name]) => ({ id, name })));
        setCategories(Array.from(categoryMap, ([id, name]) => ({ id, name })));
      } catch {
        // silently fail — user will see empty selects
      } finally {
        setOptionsLoading(false);
      }
    }

    loadOptions();
  }, []);

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function validateForm() {
    const newErrors: EventErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required.";
    }

    if (!formData.venueId) {
      newErrors.venueId = "Venue is required.";
    }

    if (!formData.date) {
      newErrors.date = "Date is required.";
    } else {
      const selected = new Date(formData.date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < now) {
        newErrors.date = "Event date cannot be in the past.";
      }
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required.";
    } else if (Number(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackMessage("");

    if (!validateForm()) {
      setFeedbackType("error");
      setFeedbackMessage("Please fix the errors before creating the event.");
      return;
    }

    setIsLoading(true);

    try {
      const eventDate = new Date(formData.date).toISOString();

      const res = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          eventDate,
          capacity: Number(formData.capacity),
          venueId: formData.venueId,
          categoryId: formData.categoryId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to create event.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Event created successfully! Redirecting...");
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        venueId: "",
        date: "",
        capacity: "",
      });

      setTimeout(() => router.push("/events"), 1500);
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Create Event
            </h1>
            <p className="mt-2 text-gray-600">
              Fill in the event details below.
            </p>
          </div>
          <Link href="/events">
            <Button variant="secondary">Back to Events</Button>
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {feedbackMessage && (
              <AlertMessage type={feedbackType} message={feedbackMessage} />
            )}

            <Input
              label="Event Title"
              name="title"
              value={formData.title}
              placeholder="Enter event title"
              error={errors.title}
              onChange={handleInputChange}
            />

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                placeholder="Enter event description"
                onChange={handleInputChange}
                rows={4}
                className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Category select */}
              <div className="space-y-2">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                {optionsLoading ? (
                  <p className="text-sm text-gray-500">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-yellow-600">
                    No categories found. Seed the database and ensure events exist.
                  </p>
                ) : (
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                      errors.categoryId
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.categoryId && (
                  <p className="text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>

              {/* Venue select */}
              <div className="space-y-2">
                <label
                  htmlFor="venueId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Venue
                </label>
                {optionsLoading ? (
                  <p className="text-sm text-gray-500">Loading venues...</p>
                ) : venues.length === 0 ? (
                  <p className="text-sm text-yellow-600">
                    No venues found. Seed the database and ensure events exist.
                  </p>
                ) : (
                  <select
                    id="venueId"
                    name="venueId"
                    value={formData.venueId}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                      errors.venueId
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  >
                    <option value="">Select venue</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.venueId && (
                  <p className="text-sm text-red-600">{errors.venueId}</p>
                )}
              </div>

              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                min={today}
                error={errors.date}
                onChange={handleInputChange}
              />

              <Input
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                placeholder="100"
                error={errors.capacity}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Create Event"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

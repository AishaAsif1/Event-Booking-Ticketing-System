"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
const today = new Date().toISOString().split("T")[0];
type EventFormData = {
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  price: string;
  capacity: string;
};

type EventErrors = {
  title?: string;
  description?: string;
  category?: string;
  venue?: string;
  date?: string;
  price?: string;
  capacity?: string;
};

export default function CreateEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    venue: "",
    date: "",
    price: "",
    capacity: "",
  });

  const [errors, setErrors] = useState<EventErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function handleDescriptionChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      description: event.target.value,
    });

    setErrors({
      ...errors,
      description: "",
    });
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

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required.";
    }
    if (!formData.date) {
  newErrors.date = "Date is required.";
} else {
  const selectedDate = new Date(formData.date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    newErrors.date = "Event date cannot be in the past.";
  }
}

    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) < 0) {
      newErrors.price = "Price cannot be negative.";
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required.";
    } else if (Number(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackMessage("");

    const isValid = validateForm();

    if (!isValid) {
      setFeedbackType("error");
      setFeedbackMessage("Please fix the errors before creating the event.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setFeedbackType("success");
      setFeedbackMessage(
        "Event form submitted successfully. API connection will be added later."
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        venue: "",
        date: "",
        price: "",
        capacity: "",
      });
    }, 1000);
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
              Fill in the event details below. This page is intended for
              organisers.
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
                onChange={handleDescriptionChange}
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
              <Input
                label="Category"
                name="category"
                value={formData.category}
                placeholder="Technology, Business..."
                error={errors.category}
                onChange={handleInputChange}
              />

              <Input
                label="Venue"
                name="venue"
                value={formData.venue}
                placeholder="Main Hall"
                error={errors.venue}
                onChange={handleInputChange}
              />
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
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                placeholder="25"
                error={errors.price}
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
"use client";

import { useState } from "react";
import Button from "./ui/Button";
import AlertMessage from "./ui/AlertMessage";
import LoadingSpinner from "./ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  capacity: number;
  status: EventStatus;
  price?: number;
  image?: string;
};

const categoryImages: Record<string, string> = {
  business: "/event-images/business.jpg",
  concert: "/event-images/concert.jpg",
  music: "/event-images/concert.jpg",
  cyber: "/event-images/cyber.jpg",
  cybersecurity: "/event-images/cyber.jpg",
  education: "/event-images/education.jpg",
  sports: "/event-images/sports.jpg",
  sport: "/event-images/sports.jpg",
  technology: "/event-images/technology.jpg",
  tech: "/event-images/technology.jpg",
  workshop: "/event-images/workshop.jpg",
};

const defaultImage = "/event-images/default-event.jpg";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getEventImage({
  image,
  category,
  title,
}: {
  image?: string;
  category: string;
  title: string;
}) {
  if (image && image.trim()) {
    return image;
  }

  const titleKey = normalizeText(title);
  const categoryKey = normalizeText(category);

  // Title-based checks first, because backend category may be wrong
  if (
    titleKey.includes("security") ||
    titleKey.includes("cyber") ||
    titleKey.includes("authentication") ||
    titleKey.includes("authorization")
  ) {
    return "/event-images/cyber.jpg";
  }

  if (
    titleKey.includes("workshop") ||
    titleKey.includes("bootcamp") ||
    titleKey.includes("training")
  ) {
    return "/event-images/workshop.jpg";
  }

  if (
    titleKey.includes("sport") ||
    titleKey.includes("football") ||
    titleKey.includes("basketball")
  ) {
    return "/event-images/sports.jpg";
  }

  if (
    titleKey.includes("concert") ||
    titleKey.includes("music") ||
    titleKey.includes("festival")
  ) {
    return "/event-images/concert.jpg";
  }

  if (
    titleKey.includes("business") ||
    titleKey.includes("startup") ||
    titleKey.includes("networking")
  ) {
    return "/event-images/business.jpg";
  }

  if (
    titleKey.includes("tech") ||
    titleKey.includes("ai") ||
    titleKey.includes("software")
  ) {
    return "/event-images/technology.jpg";
  }

  if (
    titleKey.includes("education") ||
    titleKey.includes("seminar") ||
    titleKey.includes("lecture")
  ) {
    return "/event-images/education.jpg";
  }

  // Category-based fallback
  if (categoryImages[categoryKey]) {
    return categoryImages[categoryKey];
  }

  return defaultImage;
}

export default function EventCard({
  id,
  title,
  description,
  category,
  venue,
  date,
  capacity,
  status,
  price,
  image,
}: EventCardProps) {
  const { user } = useAuth();

  const isOrganiser = user?.role === "ORGANISER";
  const isAttendee = user?.role === "ATTENDEE" || !user;

  const [isBooking, setIsBooking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

const cardImage = getEventImage({
  image,
  category,
  title,
});
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const statusClasses = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  function handleBookTicket() {
    setFeedbackMessage("");
    setIsBooking(true);

    setTimeout(() => {
      setIsBooking(false);
      setFeedbackMessage(
        "Ticket booking request is ready. API booking connection can be handled here."
      );
    }, 800);
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={cardImage}
          alt={title}
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-2xl bg-white px-4 py-2 text-center shadow-md">
          <p className="text-sm font-extrabold text-gray-900">
            {formattedDate}
          </p>
        </div>

        <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow">
            {category}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold shadow ${statusClasses[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>

        <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
          {description}
        </p>

        <div className="mt-5 grid gap-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Venue:</span> {venue}
          </p>

          <p>
            <span className="font-semibold">Capacity:</span> {capacity} seats
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Ticket price</p>
            <p className="text-xl font-extrabold text-gray-900">
              {price !== undefined ? `$${price}` : "TBA"}
            </p>
          </div>

          <p className="text-xs font-semibold text-gray-500">
            {status === "PUBLISHED"
              ? "Available now"
              : status === "DRAFT"
              ? "Draft event"
              : "Cancelled"}
          </p>
        </div>

        {feedbackMessage && (
          <div className="mt-5">
            <AlertMessage type="success" message={feedbackMessage} />
          </div>
        )}

        <div className="mt-6">
          {isAttendee && (
            <Button
              fullWidth
              disabled={status !== "PUBLISHED" || isBooking}
              onClick={handleBookTicket}
            >
              {isBooking ? (
                <LoadingSpinner />
              ) : status === "PUBLISHED" ? (
                "Book Ticket"
              ) : (
                "Not Available"
              )}
            </Button>
          )}

          {isOrganiser && (
            <Button fullWidth variant="secondary">
              Manage Event
            </Button>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">Event ID: {id}</p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import AlertMessage from "./ui/AlertMessage";
import LoadingSpinner from "./ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  capacity: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
};

export default function EventCard({
  id,
  title,
  description,
  category,
  venue,
  date,
  capacity,
  status,
}: EventCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const isOrganiser = user?.role === "ORGANISER";
  const isAttendee = user?.role === "ATTENDEE";

  const [isBooking, setIsBooking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  async function handleBookTicket() {
    if (!user) {
      router.push("/login");
      return;
    }

    setFeedbackMessage("");
    setIsBooking(true);

    try {
      const res = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({ eventId: id, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Booking failed.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Ticket booked successfully!");
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server.");
    } finally {
      setIsBooking(false);
    }
  }

  const statusColour =
    status === "PUBLISHED"
      ? "bg-green-50 text-green-700"
      : status === "CANCELLED"
        ? "bg-red-50 text-red-700"
        : "bg-yellow-50 text-yellow-700";

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {category}
        </span>

        <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColour}`}>
          {status}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{description}</p>

      <div className="mt-5 space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Venue:</span> {venue}
        </p>
        <p>
          <span className="font-medium">Date:</span> {formattedDate}
        </p>
        <p>
          <span className="font-medium">Capacity:</span> {capacity}
        </p>
      </div>

      {feedbackMessage && (
        <div className="mt-5">
          <AlertMessage type={feedbackType} message={feedbackMessage} />
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

        {!user && status === "PUBLISHED" && (
          <Button fullWidth variant="secondary" onClick={() => router.push("/login")}>
            Login to Book
          </Button>
        )}

        {isOrganiser && (
          <Button fullWidth variant="secondary">
            Manage Event
          </Button>
        )}
      </div>
    </div>
  );
}

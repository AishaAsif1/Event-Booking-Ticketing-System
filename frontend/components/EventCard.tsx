"use client";

import { useState } from "react";
import Button from "./ui/Button";
import AlertMessage from "./ui/AlertMessage";
import LoadingSpinner from "./ui/LoadingSpinner";
import { currentUser } from "../data/userRole";

type EventCardProps = {
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  price: number;
  capacity: number;
  status: "DRAFT" | "PUBLISHED";
};

export default function EventCard({
  title,
  description,
  category,
  venue,
  date,
  price,
  capacity,
  status,
}: EventCardProps) {
  const isOrganiser = currentUser.role === "ORGANISER";
  const isAttendee = currentUser.role === "ATTENDEE";

  const [isBooking, setIsBooking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  function handleBookTicket() {
    setFeedbackMessage("");
    setIsBooking(true);

    setTimeout(() => {
      setIsBooking(false);
      setFeedbackMessage(
        "Ticket booked successfully. API connection will be added later."
      );
    }, 800);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {category}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            status === "PUBLISHED"
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <div className="mt-5 space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Venue:</span> {venue}
        </p>

        <p>
          <span className="font-medium">Date:</span> {date}
        </p>

        <p>
          <span className="font-medium">Capacity:</span> {capacity}
        </p>

        <p>
          <span className="font-medium">Price:</span> ${price}
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
    </div>
  );
}
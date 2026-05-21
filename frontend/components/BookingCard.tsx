"use client";

import { useState } from "react";
import Button from "./ui/Button";
import AlertMessage from "./ui/AlertMessage";
import LoadingSpinner from "./ui/LoadingSpinner";
import { apiFetch } from "../lib/api";

type BookingCardProps = {
  eventId: string;
  eventTitle: string;
  venue: string;
  date: string;
  quantity: number;
  status: "CONFIRMED" | "CANCELLED";
  onCancelled?: () => void;
};

export default function BookingCard({
  eventId,
  eventTitle,
  venue,
  date,
  quantity,
  status: initialStatus,
  onCancelled,
}: BookingCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isCancelling, setIsCancelling] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("error");

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statusClasses = {
    CONFIRMED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  async function handleCancel() {
    setFeedback("");
    setIsCancelling(true);

    try {
      const res = await apiFetch(`/bookings/${eventId}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedback(data.message || "Could not cancel booking.");
        return;
      }

      setStatus("CANCELLED");
      setFeedbackType("success");
      setFeedback("Booking cancelled.");
      onCancelled?.();
    } catch {
      setFeedbackType("error");
      setFeedback("Could not reach the server.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{eventTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{venue}</p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${statusClasses[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
        <p>
          <span className="font-medium">Date:</span>
          <br />
          {formattedDate}
        </p>

        <p>
          <span className="font-medium">Tickets:</span>
          <br />
          {quantity}
        </p>
      </div>

      {feedback && (
        <div className="mt-4">
          <AlertMessage type={feedbackType} message={feedback} />
        </div>
      )}

      {status === "CONFIRMED" && (
        <div className="mt-5">
          <Button
            variant="secondary"
            disabled={isCancelling}
            onClick={handleCancel}
          >
            {isCancelling ? <LoadingSpinner /> : "Cancel Booking"}
          </Button>
        </div>
      )}
    </div>
  );
}

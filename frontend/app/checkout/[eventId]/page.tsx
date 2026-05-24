"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import AlertMessage from "../../../components/ui/AlertMessage";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/api";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

type EventResponse = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  price?: number;
  status: EventStatus;
  venue?: {
    id: string;
    name: string;
    city?: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
};

type CheckoutForm = {
  quantity: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

const initialForm: CheckoutForm = {
  quantity: "1",
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isExpiryValid(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})$/);

  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiry = new Date(year, month);

  return expiry > now;
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">(
    "info"
  );

  const ticketPrice = eventData?.price ?? 0;
  const quantityNumber = Number(form.quantity) || 0;
  const totalPrice = useMemo(() => {
    return ticketPrice * quantityNumber;
  }, [ticketPrice, quantityNumber]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ATTENDEE") {
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
      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to load event.");
        return;
      }

      if (data.status !== "PUBLISHED") {
        setFeedbackType("error");
        setFeedbackMessage("Only published events can be booked.");
        setEventData(data);
        return;
      }

      setEventData(data);
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setIsLoadingEvent(false);
    }
  }

  function updateField(field: keyof CheckoutForm, value: string) {
    let nextValue = value;

    if (field === "cardNumber") {
      nextValue = formatCardNumber(value);
    }

    if (field === "expiryDate") {
      nextValue = formatExpiry(value);
    }

    if (field === "cvv") {
      nextValue = onlyDigits(value).slice(0, 3);
    }

    if (field === "quantity") {
      nextValue = onlyDigits(value).slice(0, 2);
    }

    setForm((previousForm) => ({
      ...previousForm,
      [field]: nextValue,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const nextErrors: CheckoutErrors = {};

    const quantity = Number(form.quantity);
    const cardDigits = onlyDigits(form.cardNumber);

    if (!form.quantity.trim()) {
      nextErrors.quantity = "Quantity is required.";
    } else if (Number.isNaN(quantity) || quantity < 1) {
      nextErrors.quantity = "Quantity must be at least 1.";
    } else if (quantity > eventData!.capacity) {
      nextErrors.quantity = "Quantity cannot exceed event capacity.";
    }

    if (!form.cardholderName.trim()) {
      nextErrors.cardholderName = "Cardholder name is required.";
    } else if (form.cardholderName.trim().length < 3) {
      nextErrors.cardholderName = "Cardholder name must be at least 3 characters.";
    }

    if (!form.cardNumber.trim()) {
      nextErrors.cardNumber = "Card number is required.";
    } else if (cardDigits.length !== 16) {
      nextErrors.cardNumber = "Card number must contain 16 digits.";
    }

    if (!form.expiryDate.trim()) {
      nextErrors.expiryDate = "Expiry date is required.";
    } else if (!isExpiryValid(form.expiryDate)) {
      nextErrors.expiryDate = "Enter a valid future expiry date in MM/YY format.";
    }

    if (!form.cvv.trim()) {
      nextErrors.cvv = "CVV is required.";
    } else if (form.cvv.length !== 3) {
      nextErrors.cvv = "CVV must be 3 digits.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventData) return;

    if (!validateForm()) {
      setFeedbackType("error");
      setFeedbackMessage("Please fix the errors before confirming booking.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      const res = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          eventId: eventData.id,
          quantity: Number(form.quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Failed to complete booking.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Payment approved. Booking confirmed! Redirecting...");

      setTimeout(() => {
        router.push("/bookings");
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
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (!eventData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-lg rounded-3xl bg-white p-10 text-center shadow-md">
          <AlertMessage
            type={feedbackType}
            message={feedbackMessage || "Event could not be loaded."}
          />

          <div className="mt-6">
            <Link href="/events">
              <Button variant="secondary">Back to Events</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(eventData.eventDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Secure Mock Checkout
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Complete Your Booking
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Enter your ticket quantity and mock payment details to confirm your
            booking.
          </p>

          <div className="mt-6">
            <Link href="/events">
              <Button variant="secondary">Back to Events</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="h-fit rounded-3xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Event:</span> {eventData.title}
            </p>

            <p>
              <span className="font-semibold">Venue:</span>{" "}
              {eventData.venue?.name ?? "Venue TBA"}
            </p>

            <p>
              <span className="font-semibold">Date:</span> {formattedDate}
            </p>

            <p>
              <span className="font-semibold">Category:</span>{" "}
              {eventData.category?.name ?? "Category TBA"}
            </p>

            <p>
              <span className="font-semibold">Ticket Price:</span> ${ticketPrice}
            </p>

            <p>
              <span className="font-semibold">Quantity:</span>{" "}
              {form.quantity || 0}
            </p>

            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-700">Total</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-900">
                ${totalPrice}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Payment Details
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            This is a mock payment form. Card details are validated only on the
            frontend and are not stored.
          </p>

          {feedbackMessage && (
            <div className="mt-6">
              <AlertMessage type={feedbackType} message={feedbackMessage} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <div>
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(event) => updateField("quantity", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.quantity && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cardholderName"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Cardholder Name
              </label>

              <input
                id="cardholderName"
                value={form.cardholderName}
                onChange={(event) =>
                  updateField("cardholderName", event.target.value)
                }
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Aisha Asif"
              />

              {errors.cardholderName && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.cardholderName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cardNumber"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Card Number
              </label>

              <input
                id="cardNumber"
                value={form.cardNumber}
                onChange={(event) =>
                  updateField("cardNumber", event.target.value)
                }
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="4242 4242 4242 4242"
              />

              {errors.cardNumber && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Expiry Date
                </label>

                <input
                  id="expiryDate"
                  value={form.expiryDate}
                  onChange={(event) =>
                    updateField("expiryDate", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="MM/YY"
                />

                {errors.expiryDate && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cvv"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  CVV
                </label>

                <input
                  id="cvv"
                  value={form.cvv}
                  onChange={(event) => updateField("cvv", event.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="123"
                />

                {errors.cvv && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner /> : "Confirm Booking"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
import Button from "./ui/Button";
import LoadingSpinner from "./ui/LoadingSpinner";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

type BookingCardProps = {
  eventId?: string;
  eventTitle: string;
  venue: string;
  date: string;
  quantity: number;
  totalPrice?: number;
  status: BookingStatus;
  isCancelling?: boolean;
  onCancel?: () => void;
};

export default function BookingCard({
  eventId,
  eventTitle,
  venue,
  date,
  quantity,
  totalPrice,
  status,
  isCancelling = false,
  onCancel,
}: BookingCardProps) {
  const statusClasses = {
    CONFIRMED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const canCancel = status === "CONFIRMED" && Boolean(onCancel);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold text-blue-600">Booked Event</p>

          <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
            {eventTitle}
          </h2>

          <p className="mt-2 text-gray-600">{venue}</p>

          {eventId && (
            <p className="mt-2 text-xs text-gray-400">Event ID: {eventId}</p>
          )}
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${statusClasses[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">Date</p>
          <p className="mt-1 font-bold text-gray-900">{formattedDate}</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">Tickets</p>
          <p className="mt-1 font-bold text-gray-900">{quantity}</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">
            {totalPrice !== undefined ? "Total Paid" : "Status"}
          </p>

          <p className="mt-1 font-bold text-gray-900">
            {totalPrice !== undefined ? `$${totalPrice}` : status}
          </p>
        </div>
      </div>

      {canCancel && (
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" disabled={isCancelling} onClick={onCancel}>
            {isCancelling ? <LoadingSpinner /> : "Cancel Booking"}
          </Button>
        </div>
      )}

      {status === "CANCELLED" && (
        <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          This booking has been cancelled.
        </p>
      )}
    </div>
  );
}
// Gemini was used for HTML structure and styling
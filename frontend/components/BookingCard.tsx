type BookingCardProps = {
  eventTitle: string;
  venue: string;
  date: string;
  quantity: number;
  totalPrice: number;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
};

export default function BookingCard({
  eventTitle,
  venue,
  date,
  quantity,
  totalPrice,
  status,
}: BookingCardProps) {
  const statusClasses = {
    CONFIRMED: "bg-green-50 text-green-700",
    PENDING: "bg-yellow-50 text-yellow-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

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

      <div className="mt-5 grid gap-4 text-sm text-gray-700 sm:grid-cols-3">
        <p>
          <span className="font-medium">Date:</span>
          <br />
          {date}
        </p>

        <p>
          <span className="font-medium">Tickets:</span>
          <br />
          {quantity}
        </p>

        <p>
          <span className="font-medium">Total:</span>
          <br />${totalPrice}
        </p>
      </div>
    </div>
  );
}
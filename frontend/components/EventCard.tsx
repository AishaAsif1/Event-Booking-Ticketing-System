import Button from "./ui/Button";

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

      <div className="mt-6">
        <Button fullWidth disabled={status !== "PUBLISHED"}>
          {status === "PUBLISHED" ? "Book Ticket" : "Not Available"}
        </Button>
      </div>
    </div>
  );
}
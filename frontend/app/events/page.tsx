import Link from "next/link";
import EventCard from "../../components/EventCard";
import { events } from "../../data/events";
import Button from "../../components/ui/Button";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Browse Events
            </h1>
            <p className="mt-2 text-gray-600">
              Explore available events and book your tickets.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/create-event">
              <Button>Create Event</Button>
            </Link>

            <Link href="/">
              <Button variant="secondary">Back Home</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              description={event.description}
              category={event.category}
              venue={event.venue}
              date={event.date}
              price={event.price}
              capacity={event.capacity}
              status={event.status}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
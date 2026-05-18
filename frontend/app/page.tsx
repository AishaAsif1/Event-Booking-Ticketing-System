import Link from "next/link";
import Button from "../components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
          Event Booking Platform
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Discover events, book tickets, and manage your bookings through a
          simple and responsive web application.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>

          <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>

          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>

          <Link href="/bookings">
            <Button variant="secondary">My Bookings</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
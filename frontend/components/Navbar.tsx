"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const isOrganiser = user?.role === "ORGANISER";
  const isAttendee = user?.role === "ATTENDEE";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-extrabold text-white shadow-md">
            E
          </div>

          <div>
            <p className="text-2xl font-extrabold tracking-tight text-gray-900">
              Evently
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Booking & Tickets
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/events"
            className="text-sm font-semibold text-gray-700 transition hover:text-blue-600"
          >
            Events
          </Link>

          {isAttendee && (
            <Link
              href="/bookings"
              className="text-sm font-semibold text-gray-700 transition hover:text-blue-600"
            >
              My Bookings
            </Link>
          )}

          {isOrganiser && (
            <Link
              href="/create-event"
              className="text-sm font-semibold text-gray-700 transition hover:text-blue-600"
            >
              Create Event
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {user.role}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>

              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/events"
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700"
          >
            Events
          </Link>
        </div>
      </nav>
    </header>
  );
}
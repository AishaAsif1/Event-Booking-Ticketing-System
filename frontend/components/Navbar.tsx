"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const isOrganiser = user?.role === "ORGANISER";
  const isAttendee = user?.role === "ATTENDEE";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-xl font-bold text-gray-900">
            Event Booking
          </Link>

          {!isLoading && user && (
            <p className="mt-1 text-xs text-gray-500">
              {user.fullName} &middot;{" "}
              <span className="font-semibold text-blue-600">{user.role}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/events"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Events
          </Link>

          {isAttendee && (
            <Link
              href="/bookings"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              My Bookings
            </Link>
          )}

          {isOrganiser && (
            <Link
              href="/create-event"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Create Event
            </Link>
          )}

          {!isLoading && !user && (
            <>
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}

          {!isLoading && user && (
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

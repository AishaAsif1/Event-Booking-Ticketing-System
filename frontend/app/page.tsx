import Link from "next/link";
import Button from "../components/ui/Button";

const featuredEvents = [
  {
    title: "AI Future Summit",
    category: "Technology",
    date: "Jun 15",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Startup Networking Night",
    category: "Business",
    date: "Jun 20",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Creative Design Workshop",
    category: "Design",
    date: "Jul 02",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  "Technology",
  "Business",
  "Education",
  "Music",
  "Sports",
  "Food",
  "Art",
  "Networking",
];

const reviews = [
  {
    name: "Sarah K.",
    role: "Student",
    text: "Booking events became so much easier. I can quickly find what is happening and reserve my place in seconds.",
  },
  {
    name: "Ali R.",
    role: "Organiser",
    text: "The platform makes event creation simple and clear. It is exactly what organisers need for managing events.",
  },
  {
    name: "Mina T.",
    role: "Attendee",
    text: "I like how clean and easy the system feels. Everything is simple, from browsing events to checking bookings.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-purple-200/50 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-7xl">
              Find events you love. Book tickets in seconds.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 md:text-xl lg:mx-0">
                Search events, artists, or venues...
                </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/events">
                <Button>Explore Events</Button>
              </Link>

              <Link href="/register">
                <Button variant="secondary">Get Started</Button>
              </Link>
            </div>

            <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4 lg:mx-0">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-gray-900">500+</p>
                <p className="text-sm font-medium text-gray-600">Events</p>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-gray-900">10k+</p>
                <p className="text-sm font-medium text-gray-600">Tickets</p>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-gray-900">98%</p>
                <p className="text-sm font-medium text-gray-600">Happy Users</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-blue-300 blur-3xl" />
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-purple-300 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80"
                alt="People attending an event"
                className="h-80 w-full object-cover"
              />

              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    Popular Event
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    Jun 15, 2026
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  AI Future Summit
                </h2>

                <p className="mt-2 text-gray-600">
                  Join experts, students, and innovators for a full day of AI
                  talks, networking, and workshops.
                </p>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-xl font-bold text-gray-900">$25</p>
                  </div>

                  <Link href="/events">
                    <Button>Book Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 text-center md:flex-row md:items-end md:text-left">
          <div>
            <p className="font-semibold text-blue-600">Featured Events</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Events people are talking about
            </h2>
          </div>

          <Link href="/events">
            <Button variant="secondary">View All Events</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <div
              key={event.title}
              className="group overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800 shadow">
                  {event.date}
                </span>
              </div>

              <div className="p-6">
                <p className="text-sm font-semibold text-blue-600">
                  {event.category}
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  {event.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Discover a meaningful event designed for learning, networking,
                  and unforgettable experiences.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-blue-600">Browse by Category</p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Find events that match your interests
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                href="/events"
                key={category}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
              >
                <p className="text-lg font-bold text-gray-900">{category}</p>
                <p className="mt-2 text-sm text-gray-500">Explore events</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-semibold text-blue-600">How It Works</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Simple steps from discovery to booking
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 text-center shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
              🔍
            </div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">Discover</h3>
            <p className="mt-3 text-gray-600">
              Browse upcoming events and find something that matches your
              interests.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 text-center shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
              🎟️
            </div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">Book</h3>
            <p className="mt-3 text-gray-600">
              Reserve your ticket quickly with clear event details and simple
              actions.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 text-center shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">Manage</h3>
            <p className="mt-3 text-gray-600">
              View your bookings and keep track of events you are attending.
            </p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-gray-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-3xl font-bold leading-tight md:text-5xl">
            “Great events bring people together. Great platforms make that
            connection effortless.”
          </p>

          <p className="mt-6 text-gray-300">
            Built for attendees, organisers, and communities that want simple
            event discovery.
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-semibold text-blue-600">User Reviews</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            What users say about the platform
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-3xl bg-white p-6 shadow-md"
            >
              <p className="text-yellow-500">★★★★★</p>

              <p className="mt-4 leading-7 text-gray-600">“{review.text}”</p>

              <div className="mt-6">
                <p className="font-bold text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to find your next event?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-50">
            Start exploring events, reserve your tickets, and manage everything
            in one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/events">
              <button className="rounded-lg bg-white px-6 py-3 font-medium text-blue-700 transition hover:bg-blue-50">
                Browse Events
              </button>
            </Link>

            <Link href="/register">
              <button className="rounded-lg border border-white px-6 py-3 font-medium text-white transition hover:bg-white/10">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Used ChatGPT and Gemini for assistance in writing this file. The homepage is designed to be visually appealing and user-friendly, with clear sections for featured events, categories, how it works, user reviews, and a strong call to action.
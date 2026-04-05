# Event Booking & Ticketing System (Backend)

A backend API for managing events and ticket bookings, built with Node.js, Express, TypeScript, and Prisma.

## Overview

This project supports two roles:

- `ORGANISER`: create, update, publish, and delete events.
- `ATTENDEE`: browse events and create/cancel bookings.

Core capabilities:

- JWT authentication and role-based authorization.
- Event lifecycle management (`DRAFT`, `PUBLISHED`, `CANCELLED`).
- Capacity-safe booking logic to prevent overbooking.
- Pagination, filtering, search, and sorting for event listing.
- Prisma ORM with PostgreSQL.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT + bcrypt

## Project Structure

```text
Event-Booking-Ticketing-System/
	test.http
	backend/
		prisma/
			schema.prisma
			migrations/
			seed.ts
		src/
			config/
			controllers/
			middlewares/
			routes/
			validators/
			app.ts
			server.ts
```

## Prerequisites

- Node.js 20+
- npm
- A PostgreSQL database (local or cloud, such as Supabase)

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables in `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?pgbouncer=true"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
```

Notes:

- `DATABASE_URL` is required by both Prisma and runtime DB access.
- `DIRECT_URL` is optional in this codebase unless you explicitly use it.
- Keep secrets private and never commit real credentials.

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run migrations:

```bash
npx prisma migrate dev --name init
```

5. Seed data (optional):

```bash
npm run seed
```

6. Start development server:

```bash
npm run dev
```

Server URL: `http://127.0.0.1:5000`

## Available Scripts

From `backend/`:

- `npm run dev`: start development server with auto-reload.
- `npm run build`: compile TypeScript.
- `npm run start`: run compiled build from `dist/`.
- `npm run prisma:format`: format Prisma schema.
- `npm run prisma:migrate`: run Prisma migration in dev mode.
- `npm run prisma:generate`: generate Prisma client.
- `npm run seed`: run database seed script.

## API Endpoints

Base URL: `/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Events

- `GET /events`
- `GET /events/:eventId`
- `GET /events/my` (authenticated)
- `POST /events` (ORGANISER)
- `PATCH /events/:eventId/publish` (ORGANISER)
- `PATCH /events/:eventId` (ORGANISER)
- `DELETE /events/:eventId` (ORGANISER)

### Bookings

- `GET /bookings/my` (ATTENDEE)
- `POST /bookings` (ATTENDEE)
- `PATCH /bookings/:eventId/cancel` (ATTENDEE)
- `POST /bookings/organizer` (ORGANISER)

## Event List Query Parameters

Supported on `GET /api/events`:

- `page` (default: `1`)
- `limit` (default: `10`)
- `search` (title/description case-insensitive search)
- `categoryId`
- `venueId`
- `status` (`DRAFT`, `PUBLISHED`, `CANCELLED`)
- `sortBy` (`eventDate`, `title`, `createdAt`)
- `order` (`asc`, `desc`)

Example:

```http
GET /api/events?page=1&limit=10&search=workshop&status=PUBLISHED&sortBy=eventDate&order=asc
```

## Testing

You can test endpoints using:

- VS Code REST Client file: `test.http`
- Postman

Recommended flow:

1. Register organiser.
2. Login and copy JWT token.
3. Create event in `DRAFT`.
4. Publish event.
5. Register attendee and create booking.
6. Try overbooking to validate capacity checks.

### Complete Walkthrough And Coverage

The following scenarios were executed as part of the complete backend walkthrough:

- Make sure backend is running.
- Test the server is reachable.
- Register an organiser.
- Register an attendee.
- Test duplicate email rejection.
- Test bad register input.
- Login as organiser.
- Login as attendee.
- Test wrong login.
- Set Authorization header correctly.
- Create an event as organiser.
- Test that attendee cannot create an event.
- Test invalid event input.
- Publish the event as organiser.
- Test attendee cannot publish events.
- Test publish with fake event ID.
- Get all events.
- Book the event as attendee.
- Get my bookings.
- Test booking without token.
- Test booking unpublished event.
- Test duplicate booking logic.
- Capacity test.
- Test booking with a fake or invalid event ID.
- Test protected routes without token.
- Wrong login details.
- Register validation tests.
- Event validation tests.
- Booking validation test.
- Publish an already published event.

### Feature-To-Test Mapping

- Authentication and authorization:
	- Register, login, wrong credentials, duplicate email, and token-protected routes.
- Role-based access control:
	- Organiser-only event actions and attendee-only booking actions.
- Event lifecycle:
	- Create, publish, list, filter/sort, and invalid/fake ID handling.
- Booking engine:
	- Create, update duplicate booking, capacity guard, unpublished event blocking, and cancellation checks.
- Validation and error handling:
	- Register, event, and booking schema validation with expected error responses.

### Runtime Verification

- Backend server process started successfully using `npm run dev` from `backend/`.
- Health endpoint `GET /` returned a successful response from `http://127.0.0.1:5000`.


## Security Notes

- Passwords are hashed with bcrypt.
- JWT is used for stateless auth.
- Role-based middleware protects restricted routes.
- Request validation is enforced with Zod.
- Auth endpoints are rate-limited.

## Troubleshooting

- Prisma schema not found:
	- Run Prisma commands from `backend/`, not project root.
- `Cannot resolve environment variable`:
	- Ensure required variables exist in `backend/.env`.
- Prisma/client mismatch:
	- Run `npx prisma generate` after schema/config changes.

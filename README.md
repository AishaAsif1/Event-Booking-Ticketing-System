# Event Booking & Ticketing System (Backend)

A backend API for managing events and ticket bookings, built with Node.js, Express, TypeScript, and Prisma.

## Team Members

- Salar Amir - 2600229
- Nezar Wadhah - 2643997
- Aisha Asif - 2645323


## Project Overview

This project supports two roles:

- `ORGANISER`: create, update, publish, and delete events.
- `ATTENDEE`: browse events and create/cancel bookings.

## Key Features

- RESTful API structure with clear route grouping (`/api/auth`, `/api/events`, `/api/bookings`).
- JWT authentication and role-based access control (`ORGANISER`, `ATTENDEE`).
- Event lifecycle management with publish workflow (`DRAFT`, `PUBLISHED`, `CANCELLED`).
- Capacity-safe booking engine with duplicate-booking update behavior.
- Pagination support on events endpoint with metadata (`total`, `page`, `limit`, `totalPages`).
- Advanced search querying with text search, filtering, and sorting.
- Auth endpoint rate limiting to protect against abuse.
- Prisma ORM with relational models, migrations, and seed script support.

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
	README.md
	test.http
	backend/
		.env
		.gitignore
		package.json
		package-lock.json
		prisma.config.ts
		tsconfig.json
		node_modules/ (generated)
		prisma/
			schema.prisma
			seed.ts
			migrations/
				migration_lock.toml
				20260328171330_init/
					migration.sql
		src/
			app.ts
			server.ts
			config/
				prisma.ts
			controllers/
				auth.controller.ts
				booking.controller.ts
				event.controller.ts
				prisma.ts
			middlewares/
				auth.ts
				authorize.ts
				validate.ts
			routes/
				auth.routes.ts
				booking.routes.ts
				event.routes.ts
			validators/
				auth.validator.ts
				booking.validator.ts
				event.validator.ts
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

## Pagination, Rate Limiting, And Advanced Search

### Pagination

Pagination is implemented in `GET /api/events` using `page` and `limit` query parameters.

- Offset is calculated as `(page - 1) * limit`.
- Response includes pagination metadata:
	- `total`
	- `page`
	- `limit`
	- `totalPages`

Example:

```http
GET /api/events?page=2&limit=5
```

### Rate Limiting

Authentication routes are protected using `express-rate-limit`:

- Applied to:
	- `POST /api/auth/register`
	- `POST /api/auth/login`
- Current policy:
	- Time window: `15 minutes`
	- Max requests: `10` per IP per window
- On limit exceed, API returns:
	- `429 Too Many Requests`
	- Message: `Too many authentication attempts. Please try again later.`

This protects login/register endpoints against brute-force and abuse attempts.

### Advanced Search Querying

The events endpoint supports dynamic filtering and sorting:

- Text search (`search`):
	- Case-insensitive partial matching across both `title` and `description`.
- Filters:
	- `status`
	- `categoryId`
	- `venueId`
- Sorting:
	- `sortBy`: `eventDate`, `title`, `createdAt`
	- `order`: `asc` or `desc`

Example advanced query:

```http
GET /api/events?page=1&limit=10&search=security&status=PUBLISHED&categoryId=<category-uuid>&venueId=<venue-uuid>&sortBy=createdAt&order=desc
```

## Technical Requirements Coverage (Backend Part 1)

### Must Include

- RESTful API design:
	- Implemented with resource-based routes and proper HTTP methods.
- Proper route structure:
	- Route modules separated by domain (`auth`, `events`, `bookings`).
- Prisma ORM models:
	- Database access implemented through Prisma Client.
- At least 3-4 relational models:
	- Includes `User`, `Event`, `Booking`, `Venue`, `Category`, `EventImage`.
- Input validation:
	- Request validation implemented via Zod schemas.
- Authentication (sessions or JWT):
	- JWT-based stateless authentication is implemented.
- Authorisation (role-based access control):
	- Role checks enforced for organiser/attendee protected routes.
- Proper error handling:
	- Returns structured error responses with relevant status codes.
- Migrations:
	- Prisma migrations tracked under `backend/prisma/migrations`.
- Seed script with sufficient sample data:
	- Seed flow available through `npm run seed` (`backend/prisma/seed.ts`).

### Must Demonstrate

- Async/await usage:
	- Controller and database operations use async/await patterns.
- Proper HTTP status codes:
	- Uses 200/201/400/401/403/404/409/429/500 where appropriate.
- Clean separation of concerns:
	- Organized into routes, controllers, validators, middlewares, and config layers.

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

### Terminal Logging

While running `npm run dev`, monitor terminal output for runtime visibility:

- Startup logs:
	- Confirms app bootstrap and route loading.
	- Confirms active port (for example, `Server running on port 5000`).
- Error logs:
	- Controller-level failures are printed with contextual labels such as `LOGIN ERROR`, `CREATE EVENT ERROR`, and `CREATE BOOKING ERROR`.
	- Use these logs together with API response codes to debug request failures quickly.

Current logging is console-based (application startup and error tracing). If more detailed request-level tracing is required, add an HTTP request logger middleware (for example, morgan) for method, route, status code, and response time logs.


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

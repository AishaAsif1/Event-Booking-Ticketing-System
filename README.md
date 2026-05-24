# Event Booking & Ticketing System

A full-stack web platform where organisers can create and manage events, and attendees can browse events, book tickets, and manage their bookings.

This project was developed using a **Node.js + Express + TypeScript backend**, a **PostgreSQL database with Prisma ORM**, and a **Next.js frontend with React and TailwindCSS**.

---

## Team Members

- Salar Amir - 2600229
- Nezar Wadhah - 2643997
- Aisha Asif - 2645323

---

## Project Option

### Option 2: Event Booking & Ticketing System

The system allows organisers to create events and attendees to book tickets. It includes authentication, role-based access control, event management, booking capacity validation, an organiser dashboard, frontend integration, and Docker-based deployment support.

---

## Project Overview

The application supports two user roles:

### Organiser

Organisers can:

- Register and login
- Create events
- Update events
- Delete events
- Publish events
- View their organiser dashboard
- View the number of tickets sold
- View attendee lists for their events

### Attendee

Attendees can:

- Register and login
- Browse published events
- Search and filter events
- Book tickets
- Complete a mock checkout/payment flow
- View their bookings
- Cancel bookings

---

## Main Features

### Authentication and Authorization

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control with two roles:
  - ORGANISER
  - ATTENDEE
- Protected backend routes
- Protected frontend pages
- Role-based frontend UI behavior

### Event Management

Organisers can manage events through the system.

Supported event operations:

- Create event
- Update event
- Delete event
- Publish event
- View own events

Event fields include:

- Title
- Description
- Date/time
- Capacity
- Venue
- Category
- Event image

### Booking System

Attendees can book tickets for published events.

The booking system includes:

- Ticket booking by attendees
- Booking ownership by user and event
- Capacity validation
- Overbooking prevention
- Duplicate booking handling
- Booking cancellation
- Mock checkout/payment page before confirming booking

### Organiser Dashboard

The organiser dashboard allows organisers to:

- View their own events
- View total tickets sold
- View attendee lists for events

### Search, Filtering, and Pagination

The events page and backend event endpoint support:

- Event search
- Filtering
- Sorting
- Pagination

Supported event query options include:

- `page`
- `limit`
- `search`
- `categoryId`
- `venueId`
- `status`
- `sortBy`
- `order`

### User Interface

The frontend includes:

- Next.js App Router
- React components
- TailwindCSS responsive layout
- Reusable UI components
- Form validation
- Loading states
- Error messages
- Success feedback
- Improved UI polish
- Event cards
- Booking cards
- Navigation bar
- Responsive pages

### Security and Reliability

The backend includes:

- JWT authentication
- bcrypt password hashing
- Role-based middleware
- Zod validation
- Auth endpoint rate limiting
- Helmet security middleware
- CORS configuration
- Structured error handling
- Basic logging

---

## Extra Features Implemented

The following optional features were also implemented:

- Advanced filtering/search
- Pagination
- Rate limiting
- Basic logging
- Improved UI polish
- Additional validation
- Improved security measures

Admin panel was not implemented because it was listed as an optional extra feature, not a required feature.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- Fetch API

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- bcrypt
- express-rate-limit
- Helmet
- CORS

### Deployment

- Docker
- Docker Compose
- Environment variables
- Production build support


## Project Structure

```text
Event-Booking-Ticketing-System/
├── README.md
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── test.http
├── API_Test_Guide.html
│
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   └── prisma.ts
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── validators/
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── public/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── providers.tsx
    │   ├── bookings/
    │   │   └── page.tsx
    │   ├── checkout/
    │   │   └── [eventId]/
    │   │       └── page.tsx
    │   ├── create-event/
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── edit-event/
    │   │   └── [eventId]/
    │   │       └── page.tsx
    │   ├── events/
    │   │   └── page.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   └── register/
    │       └── page.tsx
    ├── components/
    │   ├── BookingCard.tsx
    │   ├── EventCard.tsx
    │   ├── Navbar.tsx
    │   └── ui/
    │       ├── AlertMessage.tsx
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       └── LoadingSpinner.tsx
    ├── context/
    │   └── AuthContext.tsx
    ├── data/
    │   ├── bookings.ts
    │   ├── events.ts
    │   └── userRole.ts
    └── lib/
        └── api.ts

```
###Prerequisites

For local development:

Node.js 20+
npm
PostgreSQL database, either local or cloud-based such as Supabase

For Docker deployment:

Docker
Docker Compose
Environment Variables

Environment variables are required for both backend and frontend.

Real secrets should not be committed to GitHub.

Backend Environment Variables

Create a .env file inside the backend/ folder:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?pgbouncer=true"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000

Explanation:

DATABASE_URL is required for Prisma and runtime database access.
DIRECT_URL may be used depending on the database provider and Prisma configuration.
JWT_SECRET is used to sign authentication tokens.
PORT defines the backend server port.
Frontend Environment Variables

Create a .env.local file inside the frontend/ folder:

NEXT_PUBLIC_API_URL="http://127.0.0.1:5000/api"

This variable tells the frontend where the backend API is running.

For Docker, this may be configured as:

NEXT_PUBLIC_API_URL="http://localhost:5000/api"
Local Development Setup
1. Clone the Repository
git clone <repository-url>
cd Event-Booking-Ticketing-System
2. Backend Setup

Move into the backend folder:

cd backend

Install dependencies:

npm install

Generate Prisma client:

npx prisma generate

Run database migrations:

npx prisma migrate dev

Seed the database:

npm run seed

Start the backend development server:

npm run dev

Backend URL:

http://127.0.0.1:5000
3. Frontend Setup

Open a new terminal and move into the frontend folder:

cd frontend

Install dependencies:

npm install

Create frontend/.env.local and add:

NEXT_PUBLIC_API_URL="http://127.0.0.1:5000/api"

Start the frontend development server:

npm run dev

Frontend URL:

http://127.0.0.1:3000
Production Build
Backend Production Build

From the backend/ folder:

npm install
npm run build
npm run start
Frontend Production Build

From the frontend/ folder:

npm install
npm run build
npm run start
Docker Deployment

The project includes Docker configuration for running the full application stack in containers.

The Docker setup includes:

PostgreSQL database container
Backend container
Frontend container
docker-compose.yml

The root-level docker-compose.yml defines the application services:

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ebts-postgres
    environment:
      POSTGRES_USER: project_user
      POSTGRES_PASSWORD: secure_password_2026
      POSTGRES_DB: event_booking_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ebts-backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: "postgresql://project_user:secure_password_2026@postgres:5432/event_booking_db?schema=public"
      JWT_SECRET: "your-production-fallback-secret-key-string"
      PORT: 5000
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ebts-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: "http://localhost:5000/api"
    depends_on:
      - backend

volumes:
  pgdata:
Run the Project with Docker Compose

From the project root:

docker-compose up --build -d

or, depending on the Docker version:

docker compose up --build -d

After the containers start:

Frontend: http://localhost:3000
Backend:  http://localhost:5000
Database: localhost:5432
Run Migrations and Seed Data in Docker

After the containers are running, execute:

docker exec -it ebts-backend npx prisma migrate deploy
docker exec -it ebts-backend npm run seed
Stop Docker Containers
docker-compose down

or:

docker compose down
Rebuild Docker Containers After Changes
docker-compose up --build -d

or:

docker compose up --build -d
Available Backend Scripts

Run these commands from the backend/ directory.

Start Development Server
npm run dev

Starts the backend development server with auto-reload.

Build Backend
npm run build

Compiles TypeScript.

Start Production Backend
npm run start

Runs the compiled backend from the production build.

Format Prisma Schema
npm run prisma:format

Formats the Prisma schema.

Run Prisma Migration
npm run prisma:migrate

Runs Prisma migration in development mode.

Generate Prisma Client
npm run prisma:generate

Generates the Prisma client.

Seed Database
npm run seed

Seeds the database with sample data.

Available Frontend Scripts

Run these commands from the frontend/ directory.

Start Development Server
npm run dev

Starts the Next.js development server.

Build Frontend
npm run build

Builds the frontend for production.

Start Production Frontend
npm run start

Runs the production frontend server.

API Endpoints

Base URL:

/api
Auth Endpoints
POST /auth/register
POST /auth/login
Event Endpoints
GET    /events
GET    /events/:eventId
GET    /events/my
POST   /events
PATCH  /events/:eventId/publish
PATCH  /events/:eventId
DELETE /events/:eventId
Booking Endpoints
GET   /bookings/my
POST  /bookings
PATCH /bookings/:eventId/cancel
POST  /bookings/organizer
Event List Query Parameters

Supported on:

GET /api/events

Available query parameters:

page
limit
search
categoryId
venueId
status
sortBy
order

Example:

GET /api/events?page=1&limit=10&search=workshop&status=PUBLISHED&sortBy=eventDate&order=asc
Frontend Pages

The frontend includes the following pages:

/

Homepage.

/register

User registration page.

/login

User login page.

/events

Browse, search, filter, and paginate events.

/create-event

Organiser-only event creation page.

/edit-event/[eventId]

Organiser-only event update page.

/bookings

Attendee booking page.

/checkout/[eventId]

Mock checkout/payment page before confirming a booking.

/dashboard

Organiser dashboard showing event management, tickets sold, and attendee list.

Testing Summary

The following scenarios were tested during development.

Authentication Tests
Register organiser
Register attendee
Reject duplicate email registration
Reject invalid registration input
Login as organiser
Login as attendee
Reject wrong login credentials
Store and use JWT token
Protect routes without token
Role-Based Access Tests
Organiser can create events
Organiser can update events
Organiser can delete events
Organiser can publish events
Attendee cannot create events
Attendee cannot publish events
Attendee cannot access organiser-only UI actions
Event Tests
Create event as organiser
Validate event input
Publish event
Get all events
Get event details
Search events
Filter events
Paginate events
Sort events
Update event
Delete event
Handle fake event ID
Prevent invalid event operations
Booking Tests
Book event as attendee
Prevent booking without token
Prevent booking unpublished event
Prevent overbooking
Validate booking quantity
Handle duplicate booking logic
Get attendee bookings
Cancel booking
Handle fake or invalid event ID
Frontend Tests
Register page validation
Login page validation
Event creation form validation
Event edit form validation
Mock checkout validation
Loading states shown correctly
Error messages shown correctly
Success messages shown correctly
Navbar changes based on login state
UI changes based on user role
Responsive layout works across screen sizes
Dashboard Tests
Organiser dashboard loads organiser events
Tickets sold are displayed
Attendee list is displayed
Organiser can manage events from dashboard
Deployment Tests
Frontend development server runs
Backend development server runs
Frontend production build completes
Backend production build completes
Docker configuration added
Docker Compose configuration added
Technical Requirements Coverage
Frontend Part 2
Requirement	Status
Next.js frontend	Completed
React components	Completed
API integration using fetch	Completed
Protected routes	Completed
Role-based UI behaviour	Completed
Form validation	Completed
Responsive layout using TailwindCSS	Completed
Meaningful user feedback with loading states and errors	Completed
Deployment Part 2
Requirement	Status
Docker configuration	Completed
Environment variables	Completed
Production build	Completed
Event Booking System Requirements
Requirement	Status
Registration and login	Completed
Organiser and attendee roles	Completed
Organisers can create events	Completed
Organisers can update events	Completed
Organisers can delete events	Completed
Event title, description, date/time, and capacity	Completed
Attendees can book tickets	Completed
Prevent overbooking	Completed
Validate capacity	Completed
Bookings belong to users and events	Completed
Organiser dashboard shows tickets sold	Completed
Organiser dashboard shows attendee list	Completed
Extra Marks Features
Extra Feature	Status
Advanced filtering or search	Completed
Pagination	Completed
Rate limiting	Completed
Admin panel	Not implemented
Basic logging	Completed
Improved UI polish	Completed
Additional validation	Completed
Improved security measures	Completed
Security Notes
Passwords are hashed using bcrypt.
JWT is used for stateless authentication.
Role-based middleware protects restricted organiser and attendee routes.
Zod validates incoming request bodies.
Auth routes are rate-limited to reduce brute-force attempts.
Helmet is used for improved HTTP security headers.
CORS is configured for frontend-backend communication.
Sensitive environment variables are excluded from Git.
Troubleshooting
Prisma schema not found

Run Prisma commands from inside the backend/ directory:

cd backend
npx prisma generate
Cannot resolve environment variable

Make sure the required .env file exists in the correct folder.

Backend environment file:

backend/.env

Frontend environment file:

frontend/.env.local
Frontend cannot connect to backend

Check that the backend is running on port 5000.

Also check that frontend/.env.local contains:

NEXT_PUBLIC_API_URL="http://127.0.0.1:5000/api"

For Docker, check that the frontend environment variable is configured as:

NEXT_PUBLIC_API_URL="http://localhost:5000/api"
Database connection error

Check:

DATABASE_URL
Database username
Database password
Database host
Database name
Whether PostgreSQL is running
Whether Supabase or the local PostgreSQL container is reachable
Docker build fails

Try rebuilding the containers:

docker-compose down
docker-compose up --build -d

or:

docker compose down
docker compose up --build -d
Docker containers are running but database is empty

Run migrations and seed again:

docker exec -it ebts-backend npx prisma migrate deploy
docker exec -it ebts-backend npm run seed
Final Submission Contents

The final submission includes:

Updated GitHub repository
Backend implementation
Frontend implementation
Dockerfile
Docker Compose configuration
README with setup and deployment instructions
Environment variable documentation
Production build instructions
API test guide / test file
Notes

This project satisfies the required backend, frontend, booking, dashboard, and deployment features for the Event Booking & Ticketing System. Bonus features such as pagination, advanced search/filtering, rate limiting, improved validation, improved security measures, and improved UI polish were also implemented.



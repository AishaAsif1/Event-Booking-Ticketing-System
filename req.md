SNG346 Web Application Development: Semester Project Handout
Dr Paulius Dilkas
Spring 2025–2026
This project simulates a real-world web application that you might be asked to develop as a freelance
web developer. Even though the scope is limited, the goal is to expose you to the experience of designing,
implementing, securing, containerising, and deploying a full-stack web application.
You may work:
• in groups of 2–3 students (recommended), or
• individually (not recommended due to workload).
The project will be delivered in two parts:
• Part 1: Backend
• Part 2: Full Stack (Frontend + Integration + Deployment)
Each project part will be evaluated through a separate interview session. The first interview (after Part
1) will focus exclusively on backend implementation. The second interview (after Part 2) will evaluate the
full-stack system, integration, and deployment.
1 Project Timeline & Important Dates
While you may want to start forming teams and thinking about the project immediately, I recommend
holding off on implementation until we cover more material (e.g., around 17th March).
Part 1: Backend
• Backend Submission Deadline: 5th April 11:59pm
• Backend Interview Week: 13th April
Part 2: Full Stack (Frontend + Integration + Deployment)
• Final Submission Deadline: 24th May 11:59pm
• Final Interview Week: 1st June
Late submissions are not accepted.
2 Project Options
You must choose one of the following three projects.
1
2.1 Option 1: Freelance Project Management Platform
Develop a web platform that allows freelancers to manage projects and collaborate with clients.
Users & Roles
• User registration and login
• Two roles:
– Freelancer
– Client
• Role-based authorisation
Projects
• Clients can create projects
• Freelancers can be assigned to projects
• Projects have:
– Title
– Description
– Status (e.g., Draft / Active / Completed)
– Owner
Tasks
• Tasks belong to projects
• Tasks have:
– Title
– Description
– Status
– Due date
• Only authorised users can modify tasks
Comments
• Users can comment on tasks
• Only project members can view comments
2.2 Option 2: Event Booking & Ticketing System
Develop a web platform where organisers can create events and users can book tickets.
2
Users & Roles
• Registration and login
• Roles:
– Organiser
– Attendee
Events
• Organisers can create, update, and delete events
• Event fields:
– Title
– Description
– Date/time
– Capacity
Booking
• Attendees can book tickets
• System must:
– Prevent overbooking
– Validate capacity
• Bookings belong to users and events
Organiser Dashboard
• View the number of tickets sold
• View attendee list
2.3 Option 3: Clinic Appointment System
Develop a web system where doctors publish availability and patients book appointments.
Users & Roles
• Registration and login
• Roles:
– Doctor
– Patient
3
Availability
• Doctors create available time slots
• Slots include:
– Date
– Start time
– End time
Appointments
• Patients book available slots
• Prevent double booking
• Appointment statuses (Booked / Cancelled / Completed)
Doctor Dashboard
• View upcoming appointments
• Manage availability
3 Technical Requirements (All Options)
3.1 Backend (Part 1)
Must include:
• RESTful API design
• Proper route structure
• Prisma ORM models
• At least 3–4 relational models (i.e., tables)
• Input validation
• Authentication (sessions or JWT)
• Authorisation (role-based access control)
• Proper error handling
• Migrations
• Seed script that automatically populates the database with sufficient sample data for testing
You must demonstrate:
• Async/await usage
• Proper HTTP status codes
• Clean separation of concerns
4
3.2 Frontend (Part 2)
Must include:
• Next.js frontend
• React components
• API integration using fetch
• Protected routes
• Role-based UI behaviour
• Form validation
• Responsive layout (TailwindCSS or equivalent)
• Meaningful user feedback (loading states, errors)
3.3 Deployment (Part 2)
Must include:
• Docker configuration
• Environment variables
• Production build
4 Deliverables
4.1 Part 1 (Backend)
Submit:
• Git repository link
• README with:
– All student IDs and names
– Setup instructions
– API documentation
– Description of architecture
• Prisma schema
• Migration files
4.2 Part 2 (Full Stack)
Submit:
• Updated repository & README with deployment instructions
• Frontend implementation
• Dockerfile
5
5 Interview-Based Evaluation
Each group will attend an interview session. During the session:
• Your application will be tested.
• Each member will be asked:
– To explain the part they implemented.
– To explain the overall architecture.
– To explain the authentication flow.
– To explain data modelling decisions.
– To explain async logic and security measures.
You must understand the entire project, not only your portion.
6 Possible Bonus Features for a Small Number of Extra Marks
• Advanced filtering or search
• Pagination
• Rate limiting
• Admin panel
• Basic logging
• Improved UI polish
• Additional validation
• Improved security measures
Bonus marks will not compensate for missing required features.
7 Academic Integrity
You are allowed to:
• search the Internet
• use online resources
• consult documentation
• use open-source code (including external libraries), and
• use generative AI tools
to help you with the project. However, the following rules strictly apply.
7.1 No Inter-Team Code Sharing
Sharing code with other teams is strictly prohibited—whether giving or receiving—even if it is only a small
fragment. Any detected code sharing between teams will be treated as an academic integrity violation.
6
7.2 Proper Citation is Mandatory
All work that was not written directly by you or your teammates must be clearly cited in the code. This
includes:
• Open-source code
• Code snippets from websites (e.g., Stack Overflow, blogs, documentation)
• Code generated by generative AI tools
Citations must be included as comments in the relevant files and should clearly indicate the source.
Example
// Source: Stack Overflow - https://... OR
// Adapted from: ChatGPT response to the question...
Failure to properly cite external material will be treated as an academic integrity violation.
7.3 Responsible Use of Generative AI
Generative AI tools may be used as assistance, but:
• You must understand all submitted code.
• You must be able to explain any part of your submission during the interview.
• Blindly copying AI-generated code without understanding it will likely result in poor performance
during the interview evaluation.
8 Final Notes
This project is designed to simulate real freelance work. The goal is not to build a large system, but to:
• Design clean APIs
• Implement secure authentication
• Model relational data correctly
• Handle asynchronous logic properly
• Deliver a working, deployable full-stack application
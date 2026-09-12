Task Management System

A full-stack Task Management System built as part of a Full Stack Developer technical assessment.

Live Deployment

Frontend: https://task-management-frontend-gxyb.onrender.com

Backend API: https://task-management-system-07lf.onrender.com

Tech Stack

Frontend

Next.js 16

React

TypeScript

Tailwind CSS

Backend

NestJS

TypeScript

TypeORM

SQLite

Deployment

GitHub

Render

Features

Create tasks

Edit tasks

Delete tasks

View tasks in Board or List mode

Search tasks

Filter by priority

Filter by status

Show/hide list fields

Task priorities: No Priority, Urgent, High, Medium, Low

Task statuses: To Do, Doing, Completed, On Hold

Responsive task management interface

REST API integration between the frontend and backend

Task Board

The Board view organizes tasks into four columns:

To Do

Doing

Completed

On Hold

The List view provides a table-style representation of the same task data.

API Endpoints

Method

Endpoint

Description

GET

/tasks

Get all tasks

GET

/tasks/:id

Get a task by ID

POST

/tasks

Create a task

PATCH

/tasks/:id

Update a task

DELETE

/tasks/:id

Delete a task

Environment Variable

The frontend uses an environment variable for the backend API URL.

Create a .env.local file inside the frontend folder:

NEXT_PUBLIC_API_URL=https://task-management-system-07lf.onrender.com

Do not commit .env.local to GitHub.

Run Locally

1. Clone the repository

git clone https://github.com/priyadharshinimurugesan29-dotcom/task-management-system.git
cd task-management-system

2. Run the backend

cd backend
npm install
npm run start:dev

The backend runs locally on:

http://localhost:3001

3. Run the frontend

Open another terminal:

cd frontend
npm install
npm run dev

The frontend runs locally on:

http://localhost:3000

For local development, the frontend environment variable should point to:

NEXT_PUBLIC_API_URL=http://localhost:3001

Project Structure

task-management-system/
├── backend/
│   ├── src/
│   │   ├── tasks/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── package.json
│
└── README.md

Validation

Before deployment, the frontend and backend were built successfully.

Backend:

npm run build

Frontend:

npm run build

The project was pushed to a public GitHub repository and deployed on Render.

Assessment Notes

This project demonstrates:

Frontend implementation using Next.js and Tailwind CSS

Backend REST API development using NestJS

Database integration using TypeORM and SQLite

Frontend/backend API communication

Reusable React components

Search, filtering, and view controls

Git version control with multiple meaningful commits

Deployment of both frontend and backend

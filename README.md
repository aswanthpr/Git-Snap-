# Git-Snap Project

A full-stack application to fetch, store, and manage GitHub user , repository data and mutual friends. Built frontend built with **React**, **TypeScript**, **Axios**, **CSS**, **useContext**, **Lucide-React**, and Backend with **express/nodejs*, **Typescript** **Sequelize/PostgreSQL** for the backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Backend Endpoints](#backend-endpoints)
- [Sample Requests](#sample-requests)
- [Environment Variables](#environment-variables)
- [Setup & Run](#setup--run)

---

## Features

### Backend Features
- Fetch GitHub user data and repositories via GitHub API.
- Save users and repositories in PostgreSQL using Sequelize ORM.
- Soft delete users with ability to restore.
- Update user fields (`location`, `blog`, `bio`).
- Search users by filters (`username`, `location`, `publicRepos`, `followers`, `following`, `createdAt`).
- Find mutual repositories between two users.
- Pagination support for search endpoints.
- Handles duplicate repositories with `bulkCreate` and `updateOnDuplicate`.
- GitHub API integration with authentication token to avoid rate limiting.

### Frontend Features
- React + TypeScript front-end for fetching and displaying user data.
- Axios for API requests.
- useContext for global state management.
- Lucide-react icons.
- Responsive UI with CSS.
- Forms to search users, view repositories, and perform mutual repository checks.

---

## Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Search all users with optional filters: `username`, `location`, `publicRepos`, `followers`, `following`, `createdAt` |
| POST | `/api/user` | Fetch GitHub user and repositories, save to DB if not exists |
| GET | `/api/user` | Get user data from database |
| DELETE | `/api/user` | Soft delete a user |
| PATCH | `/api/user` | Update user fields (`location`, `blog`, `bio`) |
| POST | `/api/user/mutual` | Find mutual repositories between two GitHub users |

---

## Sample Requests

### Search User
GET http://localhost:3000/api/user?username=&location=&publicRepos=&page=&limit=

### Search All Users
GET  http://localhost:3000/api/users?sortBy=&order=&page=&limit=

### Fetch & Save User
POST http://localhost:3000/api/user
Body:
{
"username": "johndoe"
}

shell
Copy code

### Soft Delete User
DELETE http://localhost:3000/api/user
Body:
{
"username": "johndoe"
}

shell
Copy code

### Update User
PATCH http://localhost:3000/api/user
Body:
{
"username": "johndoe",
"location": "California",
"blog": "https://myblog.com",
"bio": "Software Developer"
}

shell
Copy code

### Find Mutual Repos
POST http://localhost:3000/api/user/mutual
Body:
{
"user1": "johndoe",
"user2": "janedoe"
}

yaml
Copy code

---

## Environment Variables

Create a `.env` file in the root of the project:

PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgres://username:password@localhost:5432/dbname
NODE_ENV=development
GITHUB_FETCH_URL=https://api.github.com/users
GITHUB_TOKEN=<your_github_personal_access_token>

markdown
Copy code

- `PORT` – Port for backend server.
- `CLIENT_URL` – Frontend URL.
- `DATABASE_URL` – PostgreSQL connection URL.
- `NODE_ENV` – Environment (`development` or `production`).
- `GITHUB_FETCH_URL` – Base GitHub API URL.
- `GITHUB_TOKEN` – GitHub personal access token for authenticated requests.

---

## Setup & Run

### Backend
```bash
cd server
npm install
npm run dev   # Run in development
npm run build
npm start     # Run production build
Frontend
bash
Copy code
cd client
npm install
npm run dev   # Start React development server
Make sure .env variables are set before running the server.

PostgreSQL database should be running and accessible via DATABASE_URL.


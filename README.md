# ReactCRUD - Full Stack User Management App

A complete full-stack user management system built with **Next.js (App Router)**, **PostgreSQL**, **Material UI**, and **Docker**.

This project includes user registration, login, role-based access, and an admin dashboard to view users. It's styled with Material UI and supports automatic dark mode detection.

## Features

- User Registration & Login
- Admin View of Users
- Material UI + Dark Mode
- API Routes with Next.js App Router
- PostgreSQL via Docker
- TypeScript + Modular Folder Structure

## Getting Started

To get up and running locally, follow these steps:

1. Clone the repository

git clone https://github.com/your-username/reactcrud.git
cd reactcrud/my-next-app

2. Install dependencies

npm install

3. Create a `.env.local` file in the root of `my-next-app` with the following content:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/react_node_crud

Replace `yourpassword` with the one used in your Docker config.

4. Start PostgreSQL using Docker

docker-compose up -d

5. Start the development server

npm run dev

Visit the app at http://localhost:3000

## API Routes

- POST /api/users — Register new user
- POST /api/login — Login user
- GET /api/users — Get all users
- PUT /api/users/:id — Update user info/role
- DELETE /api/users/:id — Delete user

## Folder Structure

my-next-app/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   └── route.ts       (GET, POST)
│   │   ├── users/[id]/
│   │   │   └── route.ts       (PUT, DELETE)
│   │   └── login/
│   │       └── route.ts       (POST)
│   ├── register/
│   │   └── page.tsx           (Register page)
│   ├── login/
│   │   └── page.tsx           (Login page)
│   ├── users/
│   │   └── page.tsx           (User list page)
│   ├── layout.tsx             (App layout)
│   └── theme-provider.tsx     (Material UI dark mode setup)
├── lib/
│   └── db.ts                  (PostgreSQL pool config)
├── public/
├── .env.local
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md

## Docker Setup

Here's the Docker config for PostgreSQL. It's defined in `docker-compose.yml`:

version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: react_node_crud_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: react_node_crud
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

## Example .env.local

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/react_node_crud

## .gitignore

node_modules/
.next/
.env.local
dist/
coverage/
.DS_Store
*.log

## License

This project is licensed under the MIT License.

## Author

Azad Ahmed  
Built using Next.js, PostgreSQL, Docker, and MUI.

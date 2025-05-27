# React CRUD with User Login Tracking and Visualization

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It includes:
- User management (add, edit, delete users)
- Role management (Admins and Standard Users)
- User login tracking with PostgreSQL
- Data visualization (Bar and Pie Charts) using [Recharts](https://recharts.org)

## Getting Started

First, install dependencies:
```bash
npm install
```

Then, make sure your PostgreSQL database is running in Docker:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:14.1-alpine
```

Or use `docker-compose` if you have a `docker-compose.yml`.

Run database migrations or manually create tables as needed (e.g., `user_logins` table).

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features
- View, add, edit, and delete users
- Role-based tabs for Admins and Standard Users
- Track user login events into the `user_logins` table
- `/api/login-stats` API endpoint to aggregate login data
- Visualize login data in the **Login Chart** tab:
  - BarChart for total logins per user
  - PieChart for login distribution

## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🚀 Hama Parfum Backend - Dockerized

This setup uses **Docker Compose** to run a local **Node.js Hono** server alongside a **PostgreSQL** database for offline development.

---

## 🛠️ Quick Start

### 1. Build and Start the Services
Run this from the `backend/` directory:
```bash
docker-compose up --build
```
This will:
- Spin up a PostgreSQL database instance.
- Build the Hono application.
- Auto-generate the Prisma Client.
- Expose the API at [http://localhost:3001/](http://localhost:3001/)

---

## 🗄️ Database Management (Prisma)

Since we are using a real PostgreSQL instance inside Docker, you need to sync your `schema.prisma` with the database.

### 1. Initial Migration (Offline Dev)
To create your tables in the local Docker database:
```bash
docker-compose exec app npx prisma migrate dev --name init
```

### 2. Updating the Schema
Whenever you change `prisma/schema.prisma`:
1. Save the file.
2. Run:
   ```bash
    docker-compose exec app npx prisma migrate dev --name <describe_your_change>
   ```

---

## ☁️ Moving to Supabase (Going Online)

To point your app to Supabase instead of the local Docker database:

1. Copy your **Supabase Connection String** (transaction mode recommended).
2. Update your `.env` file (or the environment variable in `docker-compose.yml`):
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"
   ```
3. Run `npx prisma db push` (from your host) or the migrate command above from Docker to sync the Supabase database.

---

## 📁 Project Structure
- `src/index.ts`: API entry point.
- `src/routes/`: Hono routes.
- `src/db/`: Database configuration (Prisma).
- `prisma/schema.prisma`: Database models.
- `Dockerfile`: Container configuration.
- `docker-compose.yml`: Multi-container setup.

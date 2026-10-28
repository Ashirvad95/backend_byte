# Healthcare Backend

Node.js REST API using Express, PostgreSQL, Prisma, JWT, bcrypt, and Zod.

## Setup

1. Install Node.js 18+ and PostgreSQL.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
4. Run `npx prisma migrate dev --name init`.
5. Start with `npm run dev` (or `npm start`).

The health check is available at `GET /health`. Authenticated requests use
`Authorization: Bearer <token>`.

### Endpoints

- `POST /api/auth/register`, `POST /api/auth/login`
- `POST|GET /api/patients`, `GET|PUT|DELETE /api/patients/:id`
- `POST|GET /api/doctors`, `GET|PUT|DELETE /api/doctors/:id`
- `POST|GET /api/mappings`, `GET /api/mappings/:patient_id`, `DELETE /api/mappings/:id`

Patient and mapping data is scoped to the authenticated user's patients.
Passwords are never returned by the API.

# Loop Market

Loop Market is a full-stack second-hand marketplace (OLX-style) built with React, Express, and MySQL.

## Tech stack

- Frontend: React + React Router + Material UI
- Backend: Node.js + Express + Socket.io
- Database: MySQL
- Auth: JWT

## Run locally

1. Create the database schema:
   - Open MySQL and run `backend/schema.sql`.
2. Configure backend env:
   - Update `backend/.env` if needed:
     - `DB_HOST`
     - `DB_PORT`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME`
     - `JWT_SECRET`
3. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
4. Start backend:
   - `cd backend`
   - `npm run dev`
5. Start frontend:
   - `cd frontend`
   - `npm start`

## Implemented APIs

- Auth: `/api/auth/signup`, `/api/auth/login`
- Users: `/api/users/me`, `/api/users/my-products`, `/api/users` (admin)
- Products: `/api/products` CRUD
- Categories: `/api/categories` CRUD (create/delete admin only)
- Reviews: `/api/reviews`
- Wishlist: `/api/wishlist`
- Chat: `/api/chat`
- Locations: `/api/locations/governorates`, `/api/locations/cities`, `/api/locations/locations`

## Filtering & search

`GET /api/products` supports:

- `keyword` (search by title)
- `minPrice`, `maxPrice`
- `categoryId`
- `cityId`
- `governorateId`
- `sort`: `newest`, `price_asc`, `price_desc`

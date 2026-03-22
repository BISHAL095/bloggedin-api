# BloggedIn

BloggedIn is a full-stack blog platform in one repository with three apps:

- `backend/`: Express + Prisma + PostgreSQL API
- `client/`: public reader frontend
- `admin-client/`: admin authoring frontend

## What is included

### Public reader app

- Browse published posts
- Open a full post with its comments
- Register or log in as a reader
- Add comments while authenticated

### Admin app

- Admin login with JWT
- View all posts, including drafts
- Create posts
- Edit title, content, and published status
- Publish or unpublish posts
- Delete posts
- Delete comments

### Backend

- Prisma models for `User`, `Post`, and `Comment`
- JWT auth with `Authorization: Bearer <token>`
- Admin-only protected post routes
- Logged-in user comment creation
- Admin-only comment moderation

## Project structure

```text
bloggedin-api/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── services/
├── client/
│   └── src/
│       ├── components/
│       └── lib/
└── admin-client/
    └── src/
        ├── components/
        └── lib/
```

## Backend setup

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bloggedin?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3000
FRONTEND_URLS="http://localhost:5173,http://localhost:5174"
```

Install and run:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Public frontend setup

Create `client/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

Run:

```bash
cd client
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Admin frontend setup

Create `admin-client/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

Run:

```bash
cd admin-client
npm install
npm run dev -- --port 5174
```

Suggested local admin URL:

```text
http://localhost:5174
```

## API routes

### Public

- `GET /health`
- `GET /posts`
- `GET /posts/:id`

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Authenticated users

- `POST /comments`

### Admin

- `GET /posts/admin/all`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `DELETE /comments/:id`

## Postman examples

### Register a reader

`POST http://localhost:3000/auth/register`

```json
{
  "email": "reader@example.com",
  "password": "password123"
}
```

### Login as admin

`POST http://localhost:3000/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Create a post

`POST http://localhost:3000/posts`

Headers:

```text
Content-Type: application/json
Authorization: Bearer <admin-token>
```

Body:

```json
{
  "title": "Launch note",
  "content": "We shipped the public and admin frontends today.",
  "published": false
}
```

### Publish a post

`PUT http://localhost:3000/posts/<post-id>`

```json
{
  "published": true
}
```

### Comment as a logged-in user

`POST http://localhost:3000/comments`

Headers:

```text
Content-Type: application/json
Authorization: Bearer <user-token>
```

Body:

```json
{
  "content": "This is useful.",
  "postId": "<published-post-id>"
}
```

### Delete a comment as admin

`DELETE http://localhost:3000/comments/<comment-id>`

Header:

```text
Authorization: Bearer <admin-token>
```

## Promoting a user to admin

Use Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

Then update the user `role` from `USER` to `ADMIN`.

## Deploy

### Backend on Render or Railway

Set root directory to `backend/`.

Build command:

```bash
npm install && npm run prisma:generate
```

Start command:

```bash
npm start
```

Environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `FRONTEND_URLS`

If your provider supports a post-deploy command:

```bash
npm run prisma:migrate
```

### Public frontend on Vercel

Set root directory to `client/`.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Environment variable:

```env
VITE_API_URL="https://your-api-domain.com"
```

### Admin frontend on Vercel

Set root directory to `admin-client/`.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Environment variable:

```env
VITE_API_URL="https://your-api-domain.com"
```

### Deploy order

1. Deploy the backend
2. Deploy the public frontend
3. Deploy the admin frontend
4. Add both frontend URLs to `FRONTEND_URLS`
5. Redeploy the backend if the allowed origins changed

## Notes

- Public users only see published posts
- Only admins can create, edit, publish, unpublish, and delete posts
- Only logged-in users can create comments
- Only admins can delete comments
- JWTs are stored in local storage in both frontends for a simple demo flow

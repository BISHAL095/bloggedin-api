Architecture:
- Backend: REST API (Node.js, Express, Prisma)
- Public Client: React app for users
- Admin Dashboard: React app for content management

## Backend API setup

1. Create `backend/.env` with a PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bloggedin?schema=public"
PORT=3000
```

2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate the Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start the API:

```bash
npm run dev
```

## Prisma models

- `User`: author/comment owner with `email`, `password`, and `role`
- `Post`: blog post with `title`, `content`, `published`, and `authorId`
- `Comment`: comment with `content`, `postId`, and optional `userId`

## Public API

- `GET /health`
- `GET /posts`
  - Returns published posts only
- `GET /posts/:id`
  - Returns one published post with author and comments
- `POST /comments`
  - Body:

```json
{
  "content": "Nice post",
  "postId": "post-uuid",
  "userId": "user-uuid"
}
```

`userId` is optional. Comments are only accepted for published posts.

## Postman checks

1. `GET http://localhost:3000/posts`
2. `GET http://localhost:3000/posts/<post-id>`
3. `POST http://localhost:3000/comments`
   - Header: `Content-Type: application/json`
   - Body:

```json
{
  "content": "Looking forward to more posts like this.",
  "postId": "<published-post-id>"
}
```

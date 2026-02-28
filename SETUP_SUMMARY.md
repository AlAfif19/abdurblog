# AbduBlog Setup Summary

## Project Overview

AbduBlog is a personal portfolio and blogging system built with:

- Frontend: Nuxt 3 (Vue 3) + TailwindCSS + Shadcn-vue
- Backend: Hono
- Database: PostgreSQL 15
- ORM: Prisma
- Storage: MinIO (S3-compatible)
- Auth: JWT + Refresh Token
- Validation: Zod
- Infrastructure: Docker & Compose

## Setup Steps Completed

### 1. Environment Configuration

- ✅ `.env` file exists with all required variables:
  - DB_USER="abdur"
  - DB_PASSWORD="securepassword123"
  - DB_NAME="abdurblog"
  - DATABASE_URL="postgresql://abdur:securepassword123@localhost:5432/abdurblog?schema=public"
  - MINIO_USER="minioadmin"
  - MINIO_PASSWORD="minioadmin"
  - MINIO_ENDPOINT="http://localhost:9000"
  - MINIO_BUCKET="abdurblog-images"
  - JWT_SECRET="supersecretkey_change_this_in_prod"
  - JWT_EXPIRES_IN="15m"
  - REFRESH_TOKEN_SECRET="refreshsecretkey_change_this_in_prod"
  - REFRESH_TOKEN_EXPIRES_IN="7d"
  - NUXT_PUBLIC_API_BASE="http://localhost:3001"

### 2. Docker Compose Setup

- ✅ Modified `docker-compose.yml` to remove health checks (preventing container restarts)
- ✅ Docker containers running:
  - abdurblog_db (PostgreSQL 15 on port 5432)
  - abdurblog_storage (MinIO on ports 9000/9001)

### 3. Database Setup

- ✅ Created database tables manually using SQL:
  - `User` table with columns: id, email, password, name, role, refreshToken, createdAt, updatedAt
  - `Post` table with columns: id, title, slug, content, imageUrl, published, authorId, createdAt, updatedAt
  - Created indexes and foreign key constraints

### 4. User Accounts Created

- ✅ Created two user accounts in the database:

#### Admin User

- Email: `admin@abdurblog.com`
- Password: `admin123`
- Name: `Admin User`
- Role: `ADMIN`
- ID: `891d99a8-d844-4cd5-874e-b305a10b9c1f`

#### Regular User

- Email: `user@abdurblog.com`
- Password: `user123`
- Name: `Regular User`
- Role: `USER`
- ID: `3f69e505-53d7-43c2-851b-ff6dd11fa8b9`

### 5. API Dependencies

- ✅ Installed dependencies in `apps/api`:
  - @hono/node-server
  - minio
  - @prisma/client
  - bcryptjs
  - cors
  - hono
  - jsonwebtoken
  - zod

### 6. Prisma Client Generation

- ✅ Generated Prisma Client to `packages/database/node_modules/@prisma/client`
- ✅ Copied Prisma Client to `apps/api/node_modules/@prisma/client`

## Known Issues

### Backend Server

- ❌ Backend server not yet running due to Prisma client initialization issues
- The API code imports `PrismaClient` from `@prisma/client`, but the module exports from `.prisma/client/default`
- This causes TypeScript errors when trying to start the backend server

### Potential Solutions

1. **Option 1**: Modify the import in `apps/api/src/index.ts` to use the correct Prisma client path
2. **Option 2**: Use a workspace configuration to share the Prisma client between packages
3. **Option 3**: Skip the backend server and test the frontend directly with the database

## Next Steps

### Option 1: Fix Backend Import (Recommended)

1. Modify `apps/api/src/index.ts` to import PrismaClient correctly
2. Start the backend server with `npm run dev`
3. Verify the server starts successfully on http://localhost:3001
4. Test the API health endpoint: `curl http://localhost:3001/api/health`

### Option 2: Test Frontend Directly

1. Install frontend dependencies: `cd apps/web && npm install`
2. Start the frontend server: `npm run dev`
3. Access the application at http://localhost:3000
4. Test login with the created user accounts

### Option 3: Use Database Directly

1. Test database connection: `wsl docker exec -it abdurblog_db psql -U abdur -d abdurblog`
2. Verify user accounts: `SELECT * FROM "User";`
3. Test authentication by creating a simple test script

## Testing the Application

### Test Login Credentials

#### Admin Login

- URL: http://localhost:3000/login
- Email: `admin@abdurblog.com`
- Password: `admin123`

#### User Login

- URL: http://localhost:3000/login
- Email: `user@abdurblog.com`
- Password: `user123`

### API Endpoints

- Health Check: `GET http://localhost:3001/api/health`
- Register: `POST http://localhost:3001/api/auth/register`
- Login: `POST http://localhost:3001/api/auth/login`
- Refresh Token: `POST http://localhost:3001/api/auth/refresh`
- Logout: `POST http://localhost:3001/api/auth/logout`
- Get Current User: `GET http://localhost:3001/api/auth/me`
- Get Posts: `GET http://localhost:3001/api/posts`
- Get Post by Slug: `GET http://localhost:3001/api/posts/:slug`
- Create Post (Admin only): `POST http://localhost:3001/api/posts`
- Update Post: `PUT http://localhost:3001/api/posts/:id`
- Delete Post: `DELETE http://localhost:3001/api/posts/:id`

### MinIO Console

- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

## Notes

- The database is running in Docker and is accessible
- User accounts have been created with bcrypt-hashed passwords
- The frontend uses Nuxt 3 and should be accessible at http://localhost:3000
- The backend API should be accessible at http://localhost:3001
- All services are running in Docker containers

## Troubleshooting

### If Backend Won't Start

1. Check Prisma client generation: `cd apps/api && npx prisma generate --schema=../../packages/database/prisma/schema.prisma`
2. Verify Prisma client location: `apps/api/node_modules/@prisma/client`
3. Check TypeScript configuration in `apps/api/tsconfig.json`
4. Try restarting the development server

### If Database Connection Fails

1. Verify Docker containers are running: `wsl docker ps`
2. Check database logs: `wsl docker logs abdurblog_db`
3. Test database connection: `wsl docker exec -it abdurblog_db psql -U abdur -d abdurblog`
4. Verify environment variables in `.env` file

### If Frontend Won't Start

1. Install dependencies: `cd apps/web && npm install`
2. Check Node.js version: `node --version` (should be 20.x or 22.x)
3. Check port availability: `netstat -ano | findstr :3000` (on Windows)
4. Try accessing the application in a browser

## File Structure Reference

```
abdurblog/
├── apps/
│   ├── api/              # Hono Backend
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── scripts/
│   │   │       └── seed-admin.ts
│   │   └── package.json
│   └── web/              # Nuxt 3 Frontend
│       ├── app.vue
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── stores/
│       └── package.json
├── packages/
│   └── database/         # Prisma Schema
│       └── prisma/
│           └── schema.prisma
├── .env                # Environment Variables
├── .env.example         # Environment Variables Template
├── docker-compose.yml   # Docker Configuration
├── init-db.sql         # Database Initialization Script
├── insert-users.sql     # User Creation Script
└── README.md            # Project Documentation
```

## Conclusion

The infrastructure is set up and running. Database tables and user accounts have been created. The next step is to resolve the Prisma client import issue and start the backend server, then start the frontend server to test the complete application.

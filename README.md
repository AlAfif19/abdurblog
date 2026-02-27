# abdurblog

A personal portfolio and blogging system built with clean code, scalability, and security in mind.

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Nuxt 3 (Vue 3) + TailwindCSS + Shadcn-vue |
| **Backend** | Hono |
| **Database** | PostgreSQL 15 |
| **ORM** | Prisma |
| **Storage** | MinIO (S3-compatible) |
| **Auth** | JWT + Refresh Token |
| **Validation** | Zod |
| **Infrastructure** | Docker & Compose |

## Getting Started

### Prerequisites
- Node.js 20.x or 22.x
- Docker Engine & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd abdurblog
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred values
   ```

3. **Start infrastructure (DB & MinIO)**
   ```bash
   docker compose up -d
   ```

4. **Setup database**
   ```bash
   cd apps/api
   npm install
   npx prisma generate
   npx prisma db push
   ```

5. **Create admin user**
   ```bash
   npm run seed-admin
   ```

6. **Start backend**
   ```bash
   npm run dev
   ```

7. **Start frontend** (new terminal)
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

## Project Structure

```
abdurblog/
├── apps/
│   ├── web/                # Nuxt 3 Frontend
│   └── api/                # Hono Backend
├── packages/
│   └── database/           # Prisma Schema
├── .github/
│   └── workflows/          # CI/CD Pipeline
└── docker-compose.yml
```

## Development

### Backend Commands (apps/api)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run seed-admin   # Create admin user
npx prisma studio    # Open Prisma Studio
```

### Frontend Commands (apps/web)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run generate     # Generate static site
```

## Cleanup

Stop all services:
```bash
docker compose down
```

Stop and remove all data:
```bash
docker compose down -v
```

## License

MIT

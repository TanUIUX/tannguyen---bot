# Open Sunsama - Phân tích & Hướng dẫn Self-Host

## Tổng quan

[Open Sunsama](https://github.com/ShadowWalker2014/open-sunsama) là ứng dụng quản lý task và time-blocking mã nguồn mở, hỗ trợ AI (MCP Protocol). Đây là bản clone open-source của [Sunsama](https://sunsama.com) - ứng dụng daily planner nổi tiếng.

**Version hiện tại:** 1.0.10

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 19, Vite 6, TanStack Router + Query, Tailwind CSS, Radix UI |
| **Backend** | Hono 4, Drizzle ORM, PostgreSQL 15, PG Boss (background jobs), Zod |
| **Desktop** | Tauri 2 (Rust) - macOS, Windows, Linux |
| **Mobile** | Expo 52, React Native |
| **Editor** | Tiptap (ProseMirror) - rich text notes |
| **AI** | MCP Protocol - 24 tools cho Claude/Cursor |
| **Infra** | Turborepo, Bun workspaces, Docker, Railway |

## Kiến trúc

```
open-sunsama/
├── apps/
│   ├── api/           # Hono REST API (port 3001)
│   ├── web/           # React + Vite SPA (port 3000)
│   ├── desktop/       # Tauri v2 desktop wrapper
│   └── mobile/        # Expo React Native app
├── packages/
│   ├── database/      # Drizzle ORM, migrations, schema
│   ├── types/         # Shared TypeScript interfaces
│   ├── api-client/    # HTTP client + React Query hooks
│   └── utils/         # Date utils, validation, errors
├── mcp/               # MCP server cho AI assistants
└── docs/              # Documentation
```

## Tính năng chính

### Task Management
- Priorities (P0-P3) với color coding
- Subtasks với progress tracking
- Rich text notes (Tiptap editor)
- File attachments (images, videos, docs)
- Drag-and-drop reordering
- Task rollover vào lúc nửa đêm

### Time Blocking
- Visual daily/weekly calendar
- Drag to create time blocks
- Resize blocks với snap-to-grid
- Link blocks với tasks
- Focus mode với timer

### AI Integration (MCP)
- 24 MCP tools cho Claude/Cursor/Windsurf
- RESTful API với scoped API keys
- Background job processing (PG Boss)

### Multi-Platform
- Web app (React + Vite)
- Desktop apps (macOS, Windows, Linux)
- Mobile apps (iOS, Android)
- Dark/light/system themes

## Hướng dẫn Self-Host

### Yêu cầu
- Bun v1.0+ (hoặc Node.js 20+)
- PostgreSQL 15+
- S3-compatible storage (tuỳ chọn, cho file uploads)

### Các bước cài đặt

```bash
# 1. Clone repo
git clone https://github.com/ShadowWalker2014/open-sunsama.git
cd open-sunsama

# 2. Cài Bun (nếu chưa có)
curl -fsSL https://bun.sh/install | bash
source ~/.bash_profile

# 3. Cài dependencies
bun install

# 4. Khởi động PostgreSQL
docker compose up -d postgres

# 5. Cấu hình environment
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
CALENDAR_KEY=$(openssl rand -hex 32)

# Cập nhật .env và apps/api/.env với:
# DATABASE_URL=postgresql://opensunsama:opensunsama@localhost:5432/opensunsama
# JWT_SECRET=<generated value>
# CALENDAR_ENCRYPTION_KEY=<generated value>

# 6. Tạo web .env
cat > apps/web/.env << 'EOF'
VITE_API_URL=/api
VITE_WS_URL=ws://localhost:3001
EOF

# 7. Push database schema
cd packages/database && npx drizzle-kit push --force
cd ../..

# 8. Build
bun run build --filter='!@open-sunsama/desktop' --filter='!@open-sunsama/mobile' --filter='!@open-sunsama/expo-mobile'

# 9. Khởi động dev servers
bun run dev
```

### Kết quả

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| API | http://localhost:3001 |
| Drizzle Studio | http://localhost:4983 |

## Database Schema

| Table | Mục đích |
|-------|----------|
| `users` | Accounts với preferences (JSONB) |
| `tasks` | Title, notes, scheduledDate, priority (P0-P3), position |
| `subtasks` | Checklist items per task |
| `time_blocks` | Scheduled blocks linked to tasks |
| `api_keys` | Hashed keys với scopes |
| `attachments` | S3 file metadata |
| `notification_preferences` | Reminders, rollover settings |
| `calendar_accounts` | Google/Microsoft OAuth accounts |
| `calendars` | Calendar sync settings |
| `calendar_events` | Synced calendar events |

## API Endpoints

| Route | Auth | Mô tả |
|-------|------|-------|
| `/auth/*` | Mixed | Login, register, profile |
| `/tasks/*` | Yes | Task CRUD + reorder |
| `/tasks/:id/subtasks/*` | Yes | Subtask CRUD |
| `/time-blocks/*` | Yes | Time block CRUD + cascade resize |
| `/api-keys/*` | JWT | API key management |
| `/uploads/*` | Yes | S3 file uploads |
| `/health` | No | Health check |

## Kết quả Build & Test

| Component | Trạng thái |
|-----------|------------|
| `bun install` | 1406 packages |
| Database schema | OK - tất cả tables + indexes |
| API build (tsup) | OK |
| Web build (Vite) | OK - 148 URLs sitemap |
| Typecheck | OK |
| Lint | OK (chỉ expo-mobile có minor errors) |
| API health | OK - PG Boss running |
| Landing page | OK - renders đầy đủ |
| User registration | OK - tạo account thành công |
| Task creation | OK - P0-P3 priorities |
| Calendar view | OK - timeline + time indicator |
| Settings page | OK - all sections |

## Deploy Production

### Railway (Recommended)
Repo đã có sẵn `railway.toml` và Dockerfiles:
- `Dockerfile.api` - API server
- `Dockerfile.web` - Web app
- `docker-compose.yml` - Local dev với PostgreSQL

### Environment Variables cần thiết cho Production

**API:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - >=32 chars random string
- `CORS_ORIGIN` - Frontend URL
- `CALENDAR_ENCRYPTION_KEY` - 64 hex chars

**Web:**
- `VITE_API_URL` - API URL (e.g., https://api.yourapp.com)
- `VITE_WS_URL` - WebSocket URL (e.g., wss://api.yourapp.com)

## License

Non-Commercial License. Sử dụng thương mại cần enterprise license.

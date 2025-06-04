This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# project architecture

/my-nextjs-project
│
├── /app
│   ├── /(auth)
│   │   └── login
│   │       └── page.tsx      # /login page under auth group
│   ├── /admin
│   │   └── courses
│   │       └── page.tsx      # /admin/courses page
│   ├── /(root)
│   │   └── home
│   │       └── page.tsx      # /home page under root group
│   ├── /api                  # API routes (backend endpoints)
│   │   ├── /videos
│   │   │   └── upload.ts
│   │   └── /users
│   │       └── login.ts
│   ├── /components           # Shared UI components (React)
│   ├── /hooks                # React hooks
│   ├── /lib                  # Frontend helper libraries, fetch wrappers
│   ├── /styles               # Global and modular styles
│   └── /utils                # Frontend utilities
│
├── /backend                   # All backend code, logic, models, services (not pages/api)
│   ├── /config               # DB connection config, Backblaze config, env setups
│   ├── /db                   # MongoDB connection & models (Mongoose schemas)
│   ├── /services             # Business logic, Backblaze integration, video services
│   ├── /middlewares          # Backend middlewares (auth, validation)
│   └── /utils                # Backend utils/helpers
│
├── /public                   # Static assets
├── /scripts                  # Maintenance scripts, seeders, migrations, etc.
├── .env.local                # Env variables for local dev
├── next.config.js
├── package.json
└── README.md

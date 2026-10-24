# GoPratle Assignment

A full-stack requirement posting and browsing application built with Next.js, Node.js, Express, and MongoDB. Users can post event requirements across three professional categories — planner, performer, and crew — and browse all submissions in a filterable card view.

Deployed Links: 
- frontend -> https://gopratle-opal.vercel.app/
- backend -> https://gopratle-u3pj.onrender.com/
---

## Assignment Brief

Build a working requirement posting flow.

**Step 1 — Event Basics**
Capture event name, type, date or date range, location, optional venue, and a category selector (Planner, Performer, or Crew).

**Step 2 — Category-Specific Fields**
Surface fields relevant to the chosen category. Planner fields differ entirely from performer and crew fields.

**Step 3 — Submission**
On submission, data is validated, saved to MongoDB, and categorised under the selected type.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB via Mongoose |
| Validation | Zod (backend schema validation) |

---

## Project Structure

```
gopratle_assignment/
├── frontend/                        Next.js application
│   ├── app/
│   │   ├── layout.tsx               Root layout, font, metadata
│   │   ├── page.tsx                 Main page — data fetching, state, layout shell
│   │   └── globals.css              Global styles and Tailwind import
│   ├── components/
│   │   ├── Navbar.tsx               Sticky navbar with Login, Join, Post my Event
│   │   ├── HeroFilter.tsx           Hero section with category filter buttons
│   │   ├── RequirementCard.tsx      Individual event requirement card
│   │   ├── SkeletonCard.tsx         Loading placeholder card
│   │   ├── RegisterModal.tsx        2-step registration modal with full form logic
│   │   ├── MultiChips.tsx           Reusable multi-select chip toggle group
│   │   └── Icons.tsx                Inline SVG icons (MapPin, Calendar, Plus, Close)
│   ├── lib/
│   │   ├── types.ts                 Shared TypeScript types (EventRequirement, Category, etc.)
│   │   ├── constants.ts             API base URL, label maps, enum option lists
│   │   └── helpers.ts               formatDate, formatCurrency, capitalize
│   ├── next.config.ts               Rewrites /api/* to backend at localhost:5050
│   └── package.json
│
└── backend/                         Express + MongoDB API
    ├── src/
    │   ├── index.ts                 Entry point — Express app, middleware, DB connection
    │   ├── config/
    │   │   └── db.config.ts         Mongoose connection setup
    │   ├── routes/
    │   │   └── routes.ts            All API routes (register + requirements endpoints)
    │   ├── schemas/
    │   │   ├── constants.ts         Enum value lists shared across schemas
    │   │   ├── eventSchema.ts       Base fields shared by all categories
    │   │   ├── plannerSchema.ts     Zod schema for planner requirements
    │   │   ├── performerSchema.ts   Zod schema for performer requirements
    │   │   ├── crewSchema.ts        Zod schema for crew requirements
    │   │   └── requirementSchema.ts Discriminated union + cross-field date validation
    │   ├── services/
    │   │   ├── baseEvent.ts         Shared Mongoose model logic
    │   │   ├── planner.ts           Planner model and save function
    │   │   ├── performer.ts         Performer model and save function
    │   │   ├── crew.ts              Crew model and save function
    │   │   └── requirements.ts      Cross-collection fetch (all requirements or by ID)
    │   ├── seed.ts                  Seeds the database with sample data
    │   └── test.ts                  HTTP integration tests for all endpoints
    └── package.json
```

---

## API Reference

### Register endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register/planner` | Create a planner requirement |
| POST | `/api/register/performer` | Create a performer requirement |
| POST | `/api/register/crew` | Create a crew requirement |

All register endpoints validate the request body against the corresponding Zod schema. Returns `201` with the created document or `400` with Zod error details.

### Requirements endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/requirements` | Fetch all requirements (all categories merged) |
| GET | `/api/requirements?category=planner` | Fetch only planner requirements |
| GET | `/api/requirements?category=performer` | Fetch only performer requirements |
| GET | `/api/requirements?category=crew` | Fetch only crew requirements |
| GET | `/api/requirements/:id` | Fetch a single requirement by MongoDB ObjectId |

---

## Data Shape

All three categories share a common base. The `details` field is category-specific.

```ts
{
  eventName: string           // min 3 characters
  eventType: "wedding" | "concert" | "corporate" | "festival" | "birthday" | "private_party" | "other"
  dateMode: "single" | "range"
  startDate: string           // ISO — must not be in the past
  endDate?: string            // required when dateMode is "range"
  location: string
  venue?: string
  category: "planner" | "performer" | "crew"
  details: PlannerDetails | PerformerDetails | CrewDetails
}
```

**Planner details**
```ts
{
  servicesNeeded: ("full_planning" | "decor" | "catering" | "logistics" | "vendor_coordination")[]
  guestCount: number          // min 1
  budget: number              // positive
  planningStage: "idea" | "in_progress" | "almost_ready"
  teamSize: number
  notes?: string
}
```

**Performer details**
```ts
{
  actType: "singer" | "dj" | "band" | "dancer" | "comedian" | "other"
  genre: string[]             // min 1
  performerCount: number      // min 1
  durationMinutes: number     // positive
  fee: number                 // positive
  soundProvided: boolean
}
```

**Crew details**
```ts
{
  rolesNeeded: ("sound" | "lighting" | "security" | "stage" | "catering_staff" | "other")[]
  headcount: number           // min 1
  experienceLevel: "beginner" | "intermediate" | "expert"
  shiftTiming: { start: string; end: string }   // HH:mm format
  payPerDay: number           // positive
  travelProvided: boolean
  accommodationProvided: boolean
}
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string in `.env`

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/gopratle
PORT=5050
```

```bash
npm run dev        # starts the Express server on port 5050
npm run seed       # seeds the database with sample requirements
npm test           # runs HTTP integration tests against the live server
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts Next.js on port 3000
```

The frontend proxies all `/api/*` requests to `http://localhost:5050` via `next.config.ts` rewrites, so no CORS configuration is needed.

Open `http://localhost:3000`.

---


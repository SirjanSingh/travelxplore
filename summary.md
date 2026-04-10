# TravelXplore — Session Summary

## What Was Built
A full-stack **Travel & Local Experience Platform** rewritten from PHP to modern JavaScript, based on a BCA college project brief.

**GitHub Repo:** https://github.com/SirjanSingh/travelxplore  
**Local path:** `D:/projs/extra/ishu/travelxplore/`

---

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router v6 |
| Backend | Express.js + lowdb (JSON file DB, no native compilation needed) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (Google Fonts) |

> **Why lowdb instead of SQLite?** `better-sqlite3` requires native compilation (node-gyp) which failed on this Windows + Node v24 setup. `lowdb@1` is pure JS and works out of the box.

---

## Project Structure
```
travelxplore/
├── server/
│   ├── src/
│   │   ├── index.js              # Express entry point, port 5000
│   │   ├── db/schema.js          # lowdb init (db.json)
│   │   ├── middleware/auth.js    # JWT middleware (requireHost, requireTraveller)
│   │   └── routes/
│   │       ├── auth.js           # register/host, register/traveller, login, /me, profile
│   │       ├── offerings.js      # CRUD + /host/mine
│   │       ├── bookings.js       # create, /mine, /host, status patch, cancel
│   │       └── upload.js         # multer file upload → /uploads/
│   ├── uploads/                  # Uploaded images served statically
│   ├── db.json                   # Auto-created JSON database
│   ├── .env                      # PORT=5000, JWT_SECRET, CLIENT_URL
│   └── package.json
│
└── client/
    ├── src/
    │   ├── App.jsx               # Routes with RequireAuth guard
    │   ├── index.css             # Tailwind + custom component classes
    │   ├── lib/
    │   │   ├── api.js            # Axios instance with JWT interceptor
    │   │   ├── auth.js           # localStorage helpers (getUser, setAuth, clearAuth)
    │   │   └── utils.js          # TYPE_CONFIG, STATUS_CONFIG, formatPrice, PLACEHOLDER_IMAGES
    │   ├── components/
    │   │   ├── Navbar.jsx        # Floating glass navbar, role-aware links
    │   │   ├── HostSidebar.jsx   # Fixed sidebar for host pages
    │   │   ├── OfferingCard.jsx  # Card with image, type badge, price
    │   │   ├── TypeBadge.jsx     # stay/experience/cuisine/product badge
    │   │   └── LoadingSpinner.jsx
    │   └── pages/
    │       ├── Landing.jsx       # Hero, features, destinations, featured offerings, CTA
    │       ├── Login.jsx         # Split-panel, role toggle (host/traveller)
    │       ├── Signup.jsx        # Split-panel, role toggle, extra fields per role
    │       ├── Explore.jsx       # Search + type filter + offerings grid
    │       ├── OfferingDetail.jsx # Gallery, host info, booking/order form
    │       ├── host/
    │       │   ├── HostDashboard.jsx  # Stats cards + recent bookings + offerings preview
    │       │   ├── HostOfferings.jsx  # Grid with edit/delete actions
    │       │   ├── OfferingForm.jsx   # Create/edit form (type selector, image upload, product customization)
    │       │   └── HostBookings.jsx   # Confirm/decline/complete bookings, filter by status
    │       └── traveller/
    │           └── TravellerDashboard.jsx  # Stats, profile card, bookings list, cancel
    ├── vite.config.js            # Proxy /api + /uploads → localhost:5000
    └── package.json
```

---

## API Endpoints

### Auth (`/api/auth`)
- `POST /register/host` — `{ name, email, password, bio?, location? }`
- `POST /register/traveller` — `{ name, email, password, phone? }`
- `POST /login` — `{ email, password, role: "host"|"traveller" }`
- `GET /me` — requires Bearer token
- `PUT /profile` — requires Bearer token

### Offerings (`/api/offerings`)
- `GET /` — public, query params: `location`, `type`, `search`
- `GET /host/mine` — host auth required
- `GET /:id` — public
- `POST /` — host auth required
- `PUT /:id` — host auth, must own offering
- `DELETE /:id` — host auth, must own offering

### Bookings (`/api/bookings`)
- `POST /` — traveller auth
- `GET /mine` — traveller auth
- `GET /host` — host auth
- `PATCH /:id/status` — host auth `{ status: "confirmed"|"cancelled"|"completed" }`
- `PATCH /:id/cancel` — traveller auth (pending only)

### Upload (`/api/upload`)
- `POST /` — auth required, multipart `images[]`, max 5 files × 5MB

---

## Design System (ui-ux-pro-max)
- **Style:** Dark glass/modern with warm cultural accents
- **Primary color:** Amber (#F59E0B) — warmth, adventure
- **Background:** Slate-950 (#0F172A)
- **Card bg:** Slate-900 (#0F1629)
- **Typography:** Inter (body) + Playfair Display (headings)
- **Borders:** slate-800 default, amber-500 on focus/active
- **Component classes:** `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.label`, `.badge`, `.glass`, `.section-title`
- **Animations:** `animate-fade-in`, `animate-slide-up` (Tailwind keyframes)

---

## Running Locally
```bash
# Backend (port 5000)
cd server && npm install && npm run dev

# Frontend (port 5173)
cd client && npm install && npm run dev
```
Open http://localhost:5173

---

## Current Status
- [x] Backend fully built and tested (server responds on `/api/health`)
- [x] All frontend pages built
- [x] GitHub repo created and pushed: https://github.com/SirjanSingh/travelxplore
- [x] README.md written with full API reference and deployment guide
- [ ] Port 5000 was in use when user tried `npm run dev` — needed to kill PID 39648 first
  - Fix: `cmd.exe /c "taskkill /PID <PID> /F"` or restart terminal

---

## Known Issues / Next Steps
- The `.env` file is committed (contains non-sensitive dev secret) — for production, rotate `JWT_SECRET`
- `db.json` is gitignored — starts fresh on each deployment; for production use a persistent DB (PostgreSQL via Neon, Supabase, etc.)
- Image uploads save to `server/uploads/` which is not persisted on stateless deployments — use Cloudinary or S3 for production
- Can seed demo data by posting to the API after registering a host account

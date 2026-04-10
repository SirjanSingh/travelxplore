# TravelXplore

> A full-stack web platform connecting **travellers** with **local hosts** for authentic cultural experiences — stays, activities, cuisine, and unique handcrafted products across India.

**Live Demo:**
- Frontend: https://client-one-chi-98.vercel.app
- Backend API: https://travelxplore.onrender.com

**Built with:** React 18 · Vite · Tailwind CSS · Node.js · Express.js · lowdb · JWT

---

## Features

### For Travellers
- Browse and search experiences by location and type (Stay / Experience / Cuisine / Product)
- Book listings with date selection and guest count
- Pre-order customizable handcrafted products with custom notes
- Track all bookings and cancel pending ones from a personal dashboard

### For Local Hosts
- List four types of offerings: **Stay**, **Experience**, **Cuisine**, **Product**
- Upload up to 5 images per listing (or paste image URLs)
- Enable customization requests for product listings
- Manage bookings — confirm, decline, or mark as completed
- Full CRUD on all listings from a host dashboard

### Platform
- JWT-based authentication — separate roles for Host and Traveller
- bcrypt password hashing (10 salt rounds)
- Axios request interceptor for automatic token injection
- Role-based route guards (RequireAuth) on both frontend and backend
- Responsive dark-themed UI with glass-morphism design
- File upload via Multer (5 images max, 5 MB each)

---

## Project Structure

```
travelxplore/
├── client/                         # React 18 frontend (Vite)
│   ├── src/
│   │   ├── pages/                  # Landing, Auth, Host, Traveller pages
│   │   ├── components/             # Navbar, OfferingCard, BookingCard
│   │   ├── lib/
│   │   │   ├── api.js              # Axios instance + JWT interceptor
│   │   │   └── utils.js            # TYPE_CONFIG, formatPrice, getOfferingImage
│   │   └── App.jsx                 # Router + RequireAuth guard
│   ├── index.css                   # Tailwind base + custom component classes
│   └── vite.config.js              # Dev proxy: /api and /uploads → :5000
│
├── server/                         # Express.js backend
│   └── src/
│       ├── db/schema.js            # lowdb initialization (JSON file DB)
│       ├── middleware/auth.js       # JWT verify + requireHost / requireTraveller
│       ├── routes/
│       │   ├── auth.js             # Register / Login / Profile
│       │   ├── offerings.js        # CRUD for listings
│       │   ├── bookings.js         # Booking lifecycle management
│       │   └── upload.js           # Multer image upload
│       └── index.js                # Express app entry point
│
├── render.yaml                     # Render deployment config
├── TravelXplore_Report_Final.docx  # BCA project report
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/SirjanSingh/travelxplore.git
cd travelxplore
```

### 2. Setup & run the backend

```bash
cd server
npm install
npm run dev        # Starts on http://localhost:5000
```

`db.json` is auto-created on first run in the `server/` directory.

### 3. Setup & run the frontend

```bash
cd ../client
npm install
npm run dev        # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies `/api` and `/uploads` to `localhost:5000` automatically — no CORS issues in development.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register/host` | None | Register a host account |
| POST | `/register/traveller` | None | Register a traveller account |
| POST | `/login` | None | Login — pass `role: "host"` or `"traveller"` |
| GET | `/me` | Bearer token | Get current user profile |
| PUT | `/profile` | Bearer token | Update profile details |

### Offerings — `/api/offerings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | None | List all offerings (`?location=`, `?type=`, `?search=`) |
| GET | `/host/mine` | Host JWT | Get the authenticated host's listings |
| GET | `/:id` | None | Get a single offering by ID |
| POST | `/` | Host JWT | Create a new offering |
| PUT | `/:id` | Host JWT | Update an offering (ownership enforced) |
| DELETE | `/:id` | Host JWT | Delete an offering (cascades to bookings) |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Traveller JWT | Create a booking |
| GET | `/mine` | Traveller JWT | Get the traveller's booking history |
| GET | `/host` | Host JWT | Get all bookings for the host's offerings |
| PATCH | `/:id/status` | Host JWT | Set status: `confirmed` / `cancelled` / `completed` |
| PATCH | `/:id/cancel` | Traveller JWT | Cancel a pending booking |

### Upload — `/api/upload`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Bearer token | Upload images (`multipart/form-data`, field: `images`, max 5 × 5 MB) |

---

## Deployment

### Backend — Render

The `render.yaml` in the repo root handles configuration automatically.

Manual setup:
1. Create a **Web Service** pointing to the `server/` directory
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment variables:
   ```
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.vercel.app
   JWT_SECRET=your-strong-secret
   ```

> **Note:** On Render's free tier, `db.json` and uploaded images are stored in `/tmp` and reset on service restart. For persistent data, use MongoDB Atlas or Supabase.

### Frontend — Vercel

1. Import the repo and set **Root Directory** to `client/`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Vercel auto-deploys on every push to `master`

The frontend calls `https://travelxplore.onrender.com/api` by default. To override, set:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite | Component-based SPA |
| Styling | Tailwind CSS v3 | Custom component layer in index.css |
| Routing | React Router v6 | Role-based RequireAuth guard |
| HTTP Client | Axios | JWT interceptor, 401 auto-logout |
| Icons | Lucide React | SVG, tree-shaken |
| Backend | Express.js 4 | RESTful API, modular routes |
| Database | lowdb v1 | JSON file DB, zero config |
| Auth | JWT + bcryptjs | Stateless, 10-round bcrypt hashing |
| File Upload | Multer | Images only, 5 MB limit |
| Deployment | Vercel + Render | Frontend + backend split hosting |

---

## Known Limitations

- **Ephemeral data:** Render free tier resets `/tmp/db.json` on restart. Register again after a cold start.
- **Cold start delay:** Render free tier spins down after 15 min of inactivity — first request may take ~30–50 seconds.
- **No payment gateway:** Bookings are managed in-platform but payments happen outside it.
- **No admin panel:** No listing approval workflow in this version.

---

## BCA Project Report

A full project report (`TravelXplore_Report_Final.docx`) is included in the repository — covering Introduction, Objectives, SRS, System Design, Tech Stack, Testing, Implementation, Conclusion, Future Scope, and a simple "How It Works" explanation.

---

## License

MIT — free for personal and educational use.

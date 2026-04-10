# TravelXplore 🗺️

> A modern web platform connecting **travellers** with **local hosts** for authentic cultural experiences — stays, activities, cuisine, and unique handcrafted products.

**Built with:** Node.js · Express · SQLite · React · Vite · Tailwind CSS

---

## Features

### For Travellers
- Browse and search experiences by location, type (stay/experience/cuisine/product)
- Book stays with date selection
- Pre-order customized local products
- Track all bookings in a personal dashboard
- Cancel pending bookings

### For Local Hosts
- List offerings: **Stay**, **Experience**, **Cuisine**, **Product**
- Upload images or add image URLs
- Enable custom orders for products
- Manage bookings — confirm, decline, or mark complete
- Full CRUD on all listings

### Platform
- JWT-based authentication (separate for host and traveller)
- SQLite database (zero-config, file-based)
- File upload support (up to 5 images per offering, 5MB each)
- Responsive design, dark mode

---

## Project Structure

```
travelxplore/
├── server/                    # Express backend
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── db/schema.js       # SQLite schema & connection
│   │   ├── middleware/auth.js  # JWT middleware
│   │   └── routes/
│   │       ├── auth.js        # Register / Login / Profile
│   │       ├── offerings.js   # CRUD for listings
│   │       ├── bookings.js    # Booking management
│   │       └── upload.js      # Image upload
│   ├── uploads/               # Stored uploaded images
│   ├── travelxplore.db        # SQLite DB (auto-created)
│   └── package.json
│
└── client/                    # React frontend (Vite)
    ├── src/
    │   ├── App.jsx             # Routes
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Explore.jsx
    │   │   ├── OfferingDetail.jsx
    │   │   ├── host/
    │   │   │   ├── HostDashboard.jsx
    │   │   │   ├── HostOfferings.jsx
    │   │   │   ├── OfferingForm.jsx
    │   │   │   └── HostBookings.jsx
    │   │   └── traveller/
    │   │       └── TravellerDashboard.jsx
    │   ├── components/         # Shared UI components
    │   └── lib/                # API client, auth utils
    └── package.json
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
cp .env.example .env        # Edit JWT_SECRET if needed
npm run dev                 # Starts on http://localhost:5000
```

The SQLite database (`travelxplore.db`) is auto-created on first run.

### 3. Setup & run the frontend

```bash
cd ../client
npm install
npm run dev                 # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/host` | Register as host |
| POST | `/api/auth/register/traveller` | Register as traveller |
| POST | `/api/auth/login` | Login (pass `role: "host"` or `"traveller"`) |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/profile` | Update profile |

### Offerings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/offerings` | List all (filters: `location`, `type`, `search`) |
| GET  | `/api/offerings/:id` | Get single offering |
| POST | `/api/offerings` | Create (host only) |
| PUT  | `/api/offerings/:id` | Update (host, own) |
| DELETE | `/api/offerings/:id` | Delete (host, own) |
| GET  | `/api/offerings/host/mine` | Get host's own offerings |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking (traveller) |
| GET  | `/api/bookings/mine` | Traveller's own bookings |
| GET  | `/api/bookings/host` | All bookings for host's offerings |
| PATCH | `/api/bookings/:id/status` | Update status (host) |
| PATCH | `/api/bookings/:id/cancel` | Cancel (traveller) |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload images (multipart, field: `images`) |

---

## Deployment

### Backend (Railway / Render)

1. Create a new service pointing to the `server/` directory
2. Set environment variables:
   ```
   PORT=5000
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.vercel.app
   ```
3. Start command: `npm start`

### Frontend (Vercel)

1. Import the `client/` directory as a Vercel project
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. Update `vite.config.js` proxy to point to your backend URL

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Express.js |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcryptjs |
| File Upload | Multer |

---

## Screenshots

| Landing Page | Explore | Host Dashboard |
|---|---|---|
| Dark hero with search | Filter by type/location | Stats + recent bookings |

---

## License

MIT — free for personal and educational use.

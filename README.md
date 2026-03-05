<p align="center">
  <img src="public/hive-forager-ui-logo_v2.png" alt="Hive Forager Logo" width="160"/>
</p>

<h1 align="center">Hive Forager 🐝</h1>

<p align="center"><strong>The Unified Pulse of the Hive Ecosystem.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Build-Vite_7-646CFF?style=for-the-badge&logo=vite" alt="Vite 7"/>
  <img src="https://img.shields.io/badge/Routing-TanStack_Router-FF4154?style=for-the-badge&logo=tanstack" alt="TanStack Router"/>
  <img src="https://img.shields.io/badge/State-TanStack_Query-FF4154?style=for-the-badge&logo=reactquery" alt="TanStack Query"/>
  <img src="https://img.shields.io/badge/State-Zustand-443E38?style=for-the-badge" alt="Zustand"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UI-Shadcn_UI-000000?style=for-the-badge&logo=shadcnui" alt="Shadcn UI"/>
  <img src="https://img.shields.io/badge/CSS-Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Animation-Framer_Motion-6112EE?style=for-the-badge&logo=framer" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Validation-Zod-3E67B1?style=for-the-badge&logo=zod" alt="Zod"/>
  <img src="https://img.shields.io/badge/Testing-Vitest-6E9F18?style=for-the-badge&logo=vitest" alt="Vitest"/>
</p>

---

### 🌐 Overview

**Hive Forager** is a high-performance, type-safe super-app designed to serve both consumers and organizers within the
Hive Ecosystem. From interactive cinema seat booking to real-time organizer analytics, Forager provides a seamless,
high-fidelity experience across all devices.

### 🔗 The Ecosystem Hub

This frontend acts as the primary interface for a polyglot microservice backend:

* **Identity & Events:** Spring Boot (Java)
* **Movies & Showtimes:** .NET 8 (C#)
* **Gateway:** Nginx / Docker Compose

👉 **[Explore the Hive Infrastructure Hub](https://github.com/Naveen2070/The-Hive-Project)**

---

## ✨ Key Features

### 🎬 Next-Gen Ticketing

* **Interactive Seat Map:** A real-time, CSS Grid-powered engine for selecting seats with instant feedback.
* **Unified Checkout:** Seamless flow from showtime selection to digital ticket generation.
* **QR Digital Wallet:** Instant access to your tickets with auto-generated QR codes for venue entry.

### 🏢 Cinema & Venue Management

* **Location Discovery:** Browse cinema locations and explore their unique auditoriums.
* **Real-time Showtimes:** Dynamic scheduling interface for movies and global events.

### 🕵️ Organizer Suite

* **Dynamic Analytics:** Visualized revenue and sales trends using **Recharts**.
* **Mobile Scanner:** A built-in, mobile-first QR scanner for real-time attendee validation.
* **Event Lifecycle:** Full CRUD capabilities for managing global events and movie listings.

### 🛠️ Developer Experience (DX)

* **100% Type-Safe:** End-to-end type safety from routes to API responses using TanStack Router and Zod.
* **Mock Infrastructure:** A robust mock layer enabled via `VITE_ENABLE_MOCK_AUTH=true`, allowing development without a
  live backend.
* **React Compiler:** Leverages the new React 19 Compiler for zero-config performance optimizations.

---

## 🛠️ Tech Stack

| Category       | Technology                                   |
|:---------------|:---------------------------------------------|
| **Framework**  | React 19 (Strict Mode), TypeScript           |
| **Build Tool** | Vite 7                                       |
| **Routing**    | TanStack Router (File-based, Type-safe)      |
| **State**      | TanStack Query v5 (Server), Zustand (Client) |
| **Styling**    | Tailwind CSS v4, Framer Motion, Radix UI     |
| **Theming**    | Next Themes (Dark/Light/System)              |
| **Forms**      | React Hook Form + Zod Validation             |
| **Testing**    | Vitest + React Testing Library               |
| **Utilities**  | Axios, Lucide Icons, Date-fns, Sonner        |

---

## 🏗️ Project Architecture

We follow a **Feature-Driven Design** to ensure scalability and maintainability.

### 📁 Full Folder Structure

```text
src/
├── api/                        # API services & Axios interceptors
│   ├── mocks/                  # Mock data services (active when VITE_ENABLE_MOCK_AUTH=true)
│   ├── auditoriums.ts          # Hall management APIs
│   ├── auth.ts                 # Authentication APIs
│   ├── axios.ts                # Axios instance configuration
│   ├── booking.ts              # Ticket booking APIs
│   ├── cinemas.ts              # Cinema location APIs
│   ├── dashboard.ts            # Organizer analytics APIs
│   ├── events.ts               # Global event APIs
│   ├── movies.ts               # Movie catalog APIs
│   ├── showtimes.ts            # Movie scheduling APIs
│   ├── tickets.ts              # User ticket wallet APIs
│   └── user.ts                 # Profile management APIs
├── assets/                     # Static images & global assets
├── components/                 # Shared presentation components
│   ├── errors/                 # Global error boundary & 404 components
│   ├── layouts/                # Shells (Sidebar, Navbar, Auth Layouts)
│   ├── shared/                 # Reusable domain-agnostic components
│   └── ui/                     # Radix-based primitives (Shadcn)
├── features/                   # Domain-specific logic (Hooks, Components, Schemas)
│   ├── auditoriums/            # Cinema hall seating configuration
│   ├── auth/                   # Identity management (Login/Register)
│   ├── bookings/               # User ticket history & management
│   ├── checkout/               # Payment processing & booking flow
│   ├── cinemas/                # Cinema discovery & location details
│   ├── dashboard/              # Organizer analytics & revenue tracking
│   ├── events/                 # Global event catalog & CRUD
│   ├── home/                   # Landing page presentation
│   ├── movies/                 # Movie catalog & showtime selection
│   ├── organizer/              # Mobile QR scanner & check-in logic
│   ├── settings/               # Account & Security forms
│   ├── showtimes/              # Seat selection & real-time grid
│   └── tickets/                # Digital ticket generation & QR
├── hooks/                      # Shared custom React hooks (useDebounce, etc.)
├── integrations/               # External provider configurations
│   └── tanstack-query/         # QueryClient & DevTools provider
├── lib/                        # Low-level utilities & configuration
│   ├── jwt.ts                  # Token decoding logic
│   ├── motion.ts               # Framer Motion presets
│   ├── pagination-mapper.ts    # API-to-UI pagination logic
│   └── utils.ts                # Tailwind merge & CN utility
├── routes/                     # TanStack File-based routes (1:1 with URLs)
├── store/                      # Zustand stores (Auth, Preferences)
├── types/                      # Centralized TypeScript definitions & Enums
├── env.ts                      # Type-safe environment variable schema
├── main.tsx                    # Application entry point
└── styles.css                  # Global Tailwind & base styles
```

---

## 📜 Available Scripts

| Command          | Description                                |
|:-----------------|:-------------------------------------------|
| `npm run dev`    | Starts development server on port 3001     |
| `npm run build`  | Optimized production build + Type checking |
| `npm run test`   | Executes Vitest test suite                 |
| `npm run lint`   | Runs ESLint for code quality               |
| `npm run format` | Formats code using Prettier                |
| `npm run check`  | Runs Prettier fix + ESLint fix             |

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

* Node.js 22+
* npm

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen2070/The-Hive-Project.git
cd services/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup & Mock Authentication

Create a `.env.development` file in the root directory.

If you are just working on CSS or UI components and don't want to run the Spring Boot & .NET backends, you can enable
the Mock Auth bypass to jump straight into the app with Admin privileges (the system will use mock data services when
enabled):

```env
# Bypass the login screen and use mock data for UI development
VITE_ENABLE_MOCK_AUTH=true

# The API Gateway URL (if running the full Docker ecosystem)
VITE_API_URL=/api
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`. The Vite server is configured to proxy `/api` requests to `http://localhost:8080` to avoid CORS issues during local development.

---

## 🔌 Route Overview

| Path                  | Description                    | Access        |
|-----------------------|--------------------------------|---------------|
| `/`                   | Landing Page (Hero, Features)  | Public        |
| `/login`, `/register` | Authentication                 | Public        |
| `/forgot-password`    | Password Recovery              | Public        |
| `/reset-password`     | Set New Password               | Public        |
| `/events`             | Browse all events              | Public        |
| `/events/{id}`        | Event Details & Booking        | Public        |
| `/events/{id}/edit`   | Edit Event Details             | `ORGANIZER`   |
| `/events/create`      | Create new event               | `ORGANIZER`   |
| `/movies`             | Browse Movie Catalog           | Public        |
| `/movies/{id}`        | Movie Details & Showtimes      | Public        |
| `/cinemas`            | Browse Cinema Locations        | Public        |
| `/cinemas/{id}`       | Cinema Details & Auditoriums   | Public        |
| `/checkout/{id}`      | Interactive Seat Map & Booking | Authenticated |
| `/dashboard`          | Organizer Analytics            | `ORGANIZER`   |
| `/organizer/scan`     | Mobile QR Ticket Scanner       | `ORGANIZER`   |
| `/bookings`           | My Wallet (Tickets & QR Codes) | `USER`        |
| `/settings`           | Account Profile & Security     | Authenticated |

---

## 📦 Building for Production

This app uses a highly optimized multi-stage Docker build.

To create an optimized production build locally:

```bash
npm run build
```

### Docker Deployment

The included `Dockerfile` builds the application using Node 22 and serves the static assets using a lightweight **Nginx
Alpine** image. The `nginx.conf` is tuned for SPA routing (fallback to index.html) and gzip compression.

```bash
docker build -t hive-forager-ui .
docker run -p 80:80 hive-forager-ui
```

---

**Built with ⚛️ by Naveen**

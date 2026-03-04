<p style="text-align: center;">
  <img src="public/hive-forager-ui-logo_v2.png" alt="Hive Forager Logo" width="150"/>
</p>

<h1 style="text-align: center;">Hive Forager 🐝</h1>

<p style="text-align: center;"><em>A Modern, Type-Safe Super App for the Hive Ecosystem.</em></p>

<p style="text-align: center;">
  <img src="https://img.shields.io/badge/Frontend-React_19-61DAFB" alt="React 19"/>
  <img src="https://img.shields.io/badge/Build-Vite_7-646CFF" alt="Vite 7"/>
  <img src="https://img.shields.io/badge/Routing-TanStack_Router-FF4154" alt="TanStack Router"/>
  <img src="https://img.shields.io/badge/State-TanStack_Query_+_Zustand-FFB020" alt="State Management"/>
</p>

<p style="text-align: center;">
  <img src="https://img.shields.io/badge/UI-Shadcn_UI_+_TailwindCSS_v4-000000" alt="UI"/>
  <img src="https://img.shields.io/badge/Animation-Framer_Motion-EF008F" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Forms-React_Hook_Form_+_Zod-EC5990" alt="Forms"/>
  <img src="https://img.shields.io/badge/Status-Actively_Evolving-blueviolet" alt="Status"/>
</p>

---

> **Hive Forager** is the unified consumer and organizer portal for the Hive Ecosystem.  
> It delivers a seamless experience for browsing global events, booking cinema tickets with an interactive CSS Grid seat
> engine, and managing digital wallets — all powered by a polyglot microservice's backend.
---

### 🔗 The Ecosystem Hub

This frontend consumes the polyglot backend APIs (Spring Boot for Events/Identity, and .NET 8 for Movies) routed through our Nginx Gateway.
👉 **[View the Central Hive Infrastructure Hub Here](https://www.google.com/search?q=https://github.com/Naveen2070/The-Hive-Project)**

---

## 🚀 Key Features

* **🎬 Cinema & Ticketing (New):** Browse movie showtimes and book tickets using a highly interactive, real-time CSS Grid seat selection engine.
* **🎨 Modern UI/UX:** Built with **Shadcn UI**, **Tailwind CSS v4**, and **Framer Motion** for a sleek, responsive, dark-mode-first interface.
* **🔐 Mock Auth for Devs:** Includes a dedicated `.env` bypass flag so frontend developers can build UI components without needing to spin up the entire backend database and gateway.
* **👤 Digital Wallet:** Users can view active tickets, booking history, and auto-generated QR codes for entry.
* **🕵️ Organizer Tools:** Features visual revenue charts, "Recent Sales" feeds, event creation forms, and a mobile-first camera interface for scanning attendee QR tickets.
* **⚡ Performance First:** * Uses the experimental **React Compiler** (`babel-plugin-react-compiler`) for automatic memoization.
* **TanStack Router** for 100% type-safe, file-based routing and auto-code-splitting.
* **TanStack Query** for aggressive caching and server-state synchronization.



---

## 🛠️ Tech Stack

* **Core:** React 19, TypeScript, Vite 7
* **Routing:** TanStack Router (File-based routing)
* **State Management:** TanStack Query (Server State), Zustand (Client State / Auth)
* **Styling:** Tailwind CSS v4, Shadcn UI (Radix Primitives), Lucide Icons
* **Forms:** React Hook Form + Zod Validation
* **Visualization:** Recharts (Analytics), React QR Code

---

## 🏗️ Project Structure

The project follows a **Feature-Based Architecture** combined with TanStack Router's file-based routing system:

```text
src
├── api                 # Axios instance & API service layer
├── components          # Shared UI components (Buttons, Inputs, Layouts)
│   ├── ui              # Shadcn UI primitives
│   └── layouts         # AuthLayout, DashboardLayout
├── features            # Feature-specific logic (Hooks, Components)
│   ├── auth            # Login/Register forms
│   ├── bookings        # Ticket wallet & history
│   ├── dashboard       # Organizer analytics charts
│   ├── events          # Event listing & creation
│   ├── organizer       # Scanner & Management tools
│   └── settings        # Profile & Security forms
├── hooks               # Shared custom hooks
├── integrations        # Third-party providers & config (TanStack Query, DevTools)
├── routes              # File-based routes (Maps 1:1 to URLs)
│   ├── _app            # Protected routes layout (Sidebar/Navbar)
│   ├── _auth           # Public auth layout
│   └── __root.tsx      # Root provider
├── store               # Global state (Zustand - e.g., AuthStore)
└── types               # TypeScript interfaces (DTOs)
```
---

## ⚙️ Getting Started (Local Development)

### Prerequisites

* Node.js 22+
* npm

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen2070/Hive-Forager-UI.git
cd Hive-Forager-UI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup & Mock Authentication

Create a `.env.development` file in the root directory.

If you are just working on CSS or UI components and don't want to run the Spring Boot & .NET backends, you can enable the Mock Auth bypass to jump straight into the app with Admin privileges:

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

| Path                  | Description                        | Access        |
|-----------------------|------------------------------------|---------------|
| `/`                   | Landing Page (Hero, Features)      | Public        |
| `/login`, `/register` | Authentication                     | Public        |
| `/events`             | Browse all events                  | Public        |
| `/events/{id}`        | Event Details & Booking            | Public        |
| `/events/create`      | Create new event                   | `ORGANIZER`   |
| `/movies`             | **Browse Movie Catalog**           | Public        |
| `/movies/{id}`        | **Movie Details & Showtimes**      | Public        |
| `/movies/checkout`    | **Interactive Seat Map & Booking** | Authenticated |
| `/dashboard`          | Organizer Analytics                | `ORGANIZER`   |
| `/organizer/scan`     | Mobile QR Ticket Scanner           | `ORGANIZER`   |
| `/bookings`           | My Wallet (Tickets & QR Codes)     | `USER`        |
| `/settings`           | Account Profile & Security         | Authenticated |

---

## 📦 Building for Production

This app uses a highly optimized multi-stage Docker build.

To create an optimized production build locally:

```bash
npm run build
```

### Docker Deployment

The included `Dockerfile` builds the application using Node 22 and serves the static assets using a lightweight **Nginx Alpine** image.

```bash
docker build -t hive-forager-ui .
docker run -p 80:80 hive-forager-ui
```

---

**Built with ⚛️ by Naveen**
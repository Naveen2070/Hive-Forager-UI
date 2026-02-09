# EventHive - Frontend 🐝

> A modern, type-safe, and high-performance React frontend for the EventHive platform, built with **Vite**, **TanStack Router**, and **Tailwind CSS**.

The EventHive Frontend is a production-ready single-page application (SPA) designed to provide a seamless experience for both Attendees and Organizers. It features a responsive **Dark Mode** UI, complex form handling with validation, real-time dashboards, and a mobile-optimized QR scanner for event entry.

---

### 🔗 Backend Repository
This frontend is designed to consume the **EventHive API**.
👉 **[View the Backend Repository here](https://github.com/Naveen2070/EventHive)**

---

## 🚀 Key Features

* **🎨 Modern UI/UX:** Built with **Shadcn UI** and **Tailwind CSS** for a sleek, accessible, and responsive dark-mode interface.
* **🔐 Secure Authentication:** Complete flow including Login, Registration, and **Forgot/Reset Password** handling with JWT storage.
* **👤 User Dashboard:**
* **Digital Wallet:** View active tickets and booking history.
* **QR Generation:** Auto-generates unique QR codes for entry.
* **Profile Settings:** Manage display name, security settings, and password updates.


* **🕵️ Organizer Tools:**
* **Analytics Dashboard:** Visual revenue charts and "Recent Sales" feeds.
* **Event Management:** Create and edit events with multi-tier ticketing options.
* **Ticket Scanner:** Mobile-first camera interface for validating attendee tickets in real-time.


* **⚡ Performance First:**
* **Type-Safe Routing:** Uses **TanStack Router** for 100% type-safe navigation and automatic code splitting.
* **Server State Management:** Uses **TanStack Query** for caching, optimistic updates, and background refetching.



---

## 🛠️ Tech Stack

* **Core:** React 18, TypeScript, Vite
* **Routing:** TanStack Router (File-based routing)
* **State Management:** TanStack Query (Server State), Zustand (Client State)
* **Styling:** Tailwind CSS, Shadcn UI (Radix Primitives), Lucide Icons
* **Forms:** React Hook Form + Zod Validation
* **Visualization:** Recharts (Analytics), React QR Code
* **Animation:** Framer Motion

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

## ⚙️ Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen2070/EventHive-UI
cd EventHive-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory. By default, the app proxies requests to `http://localhost:8080` to avoid CORS issues.

```env
# Optional: Only needed if backend is not on localhost:8080
VITE_API_URL=http://localhost:8080/api
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or the port shown in your terminal).

---

## 🔌 Route Overview

| Path                  | Description                   | Access        |
|-----------------------|-------------------------------|---------------|
| `/`                   | Landing Page (Hero, Features) | Public        |
| `/login`, `/register` | Authentication                | Public        |
| `/events`             | Browse all events             | Public        |
| `/events/{id}`        | Event Details & Booking       | Public        |
| `/dashboard`          | **Organizer Analytics**       | `ORGANIZER`   |
| `/events/create`      | Create new event              | `ORGANIZER`   |
| `/organizer/scan`     | **QR Ticket Scanner**         | `ORGANIZER`   |
| `/bookings`           | **My Wallet** (Tickets)       | `USER`        |
| `/settings`           | Account Profile & Security    | Authenticated |

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

This generates static files in the `dist/` directory.

### Deployment Note

Since this is an SPA, ensure your web server (Nginx, Vercel, or Spring Boot) redirects all 404 requests to `index.html` so that TanStack Router can handle the client-side routing.

---

## 📜 License

This project is licensed under the MIT License.

---

## 🎨 UI Preview

The application features a responsive layout that adapts from Desktop Dashboards to Mobile Scanners.

* **Dashboard:** Uses Grid layouts for KPI cards and Charts.
* **Scanner:** Uses absolute positioning overlays for the camera view.
* **Settings:** Uses Tabbed interfaces with animated transitions.

---

**Built with ⚛️ by Naveen**
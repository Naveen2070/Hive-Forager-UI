<p align="center">
<img src="public/hive-forager-ui-logo_v2.png" alt="Hive Forager Logo" width="150"/>
</p>

<h1 align="center">Hive-Forager (Unified Pulse UI)</h1>

<p align="center"><em>The high-fidelity frontend gateway for the Hive ecosystem, delivering seamless event discovery, interactive ticketing, and real-time organizer analytics.</em></p>

<p align="center">
<img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Framework-React_19-61DAFB?logo=react&logoColor=white" alt="React 19"/>
<img src="https://img.shields.io/badge/Build-Vite_7-646CFF?logo=vite&logoColor=white" alt="Vite 7"/>
<img src="https://img.shields.io/badge/Routing-TanStack_Router-FF4154?logo=tanstack&logoColor=white" alt="TanStack Router"/>
<img src="https://img.shields.io/badge/Query-TanStack_Query-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query"/>
<img src="https://img.shields.io/badge/CSS-Tailwind_4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
<img src="https://img.shields.io/badge/Testing-Vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest"/>
<img src="https://img.shields.io/badge/Containerization-Docker-2496ED?logo=docker&logoColor=white" alt="Docker"/>
</p>

---

> **Hive-Forager** is the unified frontend for the Hive platform. Built with **React 19** and **TypeScript**, it
> provides a
> high-performance, type-safe interface for consumers to book tickets and for organizers to manage events and track
> business performance through real-time dashboards.

---

### 🔗 Associated Repositories

* 👉 **[The-Hive-Project (Main Hub)](https://github.com/Naveen2070/The-Hive-Project)**
* 👉 **[Hive-Movie (Catalog Service)](https://github.com/Naveen2070/The-Hive-Project/tree/main/services/movie-service)**
* 👉 **[Hive-Identity (Auth Service)](https://github.com/Naveen2070/The-Hive-Project/tree/main/services/identity-service)
  **

---

## 🚀 Key Features

* **⚡ Next-Gen Ticketing:** Interactive, CSS Grid-powered seat mapping for showtimes with real-time availability updates
  and atomic reservation flows.
* **📊 Organizer Dashboard:** Comprehensive analytics suite featuring revenue trends, sales growth metrics, and recent
  transaction history visualized with **Recharts**.
* **🔍 Seamless Discovery:** Advanced filtering and search for movies, global events, and cinema locations across the
  entire ecosystem.
* **📱 Mobile QR Scanner:** Built-in, browser-based QR code scanner for organizers to perform real-time attendee
  check-ins and ticket validation.
* **🛡️ Type-Safe Routing:** 100% end-to-end type safety using **TanStack Router**, ensuring runtime stability and a
  superior developer experience.
* **🛠️ Robust Mock Layer:** Fully functional mock infrastructure enabled via environment flags, allowing for UI
  development and testing without a live backend.
* **🧪 Comprehensive Testing:** Rigorous test suite using **Vitest** and **React Testing Library**, covering everything
  from utility logic to complex UI components.

---

## 🛠️ Tech Stack

* **Core Framework:** React 19 (Strict Mode)
* **Language:** TypeScript 5+
* **Build Engine:** Vite 7
* **Routing:** TanStack Router (File-based, Type-safe)
* **Server State:** TanStack Query v5
* **Client State:** Zustand
* **Styling:** Tailwind CSS v4, Framer Motion
* **UI Components:** Shadcn UI (Radix UI Primitives)
* **Form Handling:** React Hook Form + Zod
* **Testing:** Vitest + React Testing Library

---

## 🏗️ Architecture

The project follows a **Feature-Driven Design (FDD)** pattern, modularizing logic by domain:

```text
src/
├── api/          # API Service Layer & Axios Configuration
├── assets/       # Static images, illustrations, & global assets
├── components/   # Shared UI components (Atomic design)
├── features/     # Domain-specific logic (Auditoriums, Auth, Dashboard, etc.)
├── hooks/        # Global custom React hooks
├── integrations/ # External provider configurations (QueryClient)
├── lib/          # Utilities, JWT handling, & Framer Motion presets
├── routes/       # TanStack file-based route definitions
├── routes-test/  # Integration tests for application routes
├── store/        # Zustand global state (Auth, UI state)
├── test/         # Vitest setup & global testing utilities
└── types/        # Centralized TypeScript definitions & Enums
```

---

## ⚙️ Getting Started (How to Run)

### Prerequisites

* **Node.js 22+**
* **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen2070/The-Hive-Project.git
cd services/frontend
```

### 2. Configuration (`.env.development`)

```env
# Enable mock data for offline development
VITE_ENABLE_MOCK_AUTH=true

# API Gateway URL
VITE_API_URL=/api
```

### 3. Install & Run

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3001`.

---

## 🔌 Page & Route Overview

| Path                   | Description                     | Access          |
|:-----------------------|:--------------------------------|:----------------|
| `/`                    | Landing Page (Hero, Features)   | Public          |
| `/login` / `/register` | Authentication & Identity       | Public          |
| `/events`              | Global Event Catalog            | Public          |
| `/events/{id}`         | Event Details & Registration    | Public          |
| `/movies`              | Movie Discovery Hub             | Public          |
| `/movies/{id}`         | Movie Details & Showtimes       | Public          |
| `/checkout/{id}`       | Interactive Seat Map & Payment  | Authenticated   |
| `/dashboard`           | Organizer Revenue & Sales Stats | Organizer/Admin |
| `/organizer/scan`      | QR Ticket Scanner & Check-in    | Organizer/Admin |
| `/bookings`            | User Wallet & Digital Tickets   | User            |
| `/settings`            | Account Profile & Security      | Authenticated   |

---

<p align="center">
Built with ❤️, ⚛️, and modern TypeScript. 🚀<br>
<b>Architected and maintained by <a href="https://github.com/Naveen2070">Naveen</a></b>
</p>

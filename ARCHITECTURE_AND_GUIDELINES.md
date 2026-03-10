# Architecture & Development Guidelines

Welcome to the Frontend Service (`hive-forager-ui`) of The Hive Project. This document outlines the architectural
choices, design patterns, engineering best practices, and development workflows used in this application.

---

## 1. Architectural Patterns

### 1.1. Feature-Driven Design (FDD)

The project is organized by **Features** rather than just by technical layers (components/hooks/services). This ensures
that all logic related to a specific domain (e.g., `checkout`, `dashboard`) is co-located.

#### Project Structure

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

* **`src/features/`**: The heart of the application. Each sub-folder contains domain-specific components, hooks, and
  logic.
* **`src/api/`**: Centralized API layer using Axios. Handles request/response interceptors and global error handling.
* **`src/routes/`**: File-based routing using **TanStack Router**, providing 100% type safety for URLs and search
  parameters.
* **`src/components/`**: Shared, domain-agnostic UI components (e.g., standard buttons, inputs, layouts).
* **`src/store/`**: Global client-side state management using **Zustand**.

### 1.2. Type-Safe Data Flow

We leverage TypeScript and Zod to ensure data integrity from the API to the UI.

* **API Types**: Centralized in `src/types/` to be shared across features.
* **Validation**: Zod schemas are used for form validation and environment variable parsing.

---

## 2. Design Patterns & State Management

### 2.1. Server State vs. Client State

We maintain a strict separation between data fetched from the server and local UI state.

* **TanStack Query (Server State)**: Used for caching, synchronizing, and updating server data. This reduces the need
  for complex global state for data that exists in the database.
* **Zustand (Client State)**: Used for ephemeral UI state like authentication sessions, theme preferences, and
  persistent local settings.

### 2.2. Composition & Primitives

We use a "Primitive-First" approach for UI development:

* **Radix UI**: Provides the accessible, unstyled primitives (Dialogs, Tabs, etc.).
* **Shadcn UI (Tailwind CSS)**: Provides the visual styling layer on top of Radix, ensuring a consistent and modern
  look.

### 2.3. Compound Components

For complex UI elements (like the `Sidebar` or `Table`), we use the compound component pattern to provide a flexible and
readable API for developers.

---

## 3. Engineering Best Practices

### 3.1. 100% Type-Safe Routing

We use **TanStack Router**. Avoid using raw strings for links. Always use the generated `Link` component or the
`useNavigate` hook with full type support to prevent broken links.

### 3.2. Mocking Strategy

To enable rapid UI development without a live backend:

* **`VITE_ENABLE_MOCK_AUTH`**: When enabled, the `authStore` and API layer bypass real network calls and use localized
  mock data from `src/api/mocks/`.

### 3.3. Performance Optimization

* **React Compiler**: The project is configured to use the React 19 Compiler, which automatically optimizes re-renders.
* **Lazy Loading**: Routes and heavy components are automatically code-split to ensure fast initial page loads.

### 3.4. Forms and Validation

Always use **React Hook Form** in combination with **Zod**. This provides a robust, performant, and type-safe way to
handle user input.

---

## 4. Testing Strategy

* **Unit Tests**: Focused on utility functions and hooks, located in `.test.ts` files adjacent to their implementation.
* **Component Tests**: Using **Vitest** and **React Testing Library** to verify UI behavior and accessibility.
* **Integration Tests**: Verifying complex flows like authentication or checkout using mock service workers.

---

## 5. How to Add a New Feature (Developer Guide)

If you need to add a new feature (e.g., "Event Reviews"), follow this workflow:

1. **Define the Feature Folder (`src/features/reviews/`)**:
    * Create sub-folders for `components`, `hooks`, and `types` if necessary.
2. **Define the API Service (`src/api/reviews.ts`)**:
    * Implement the Axios calls for the new domain.
3. **Add the Route (`src/routes/_app.reviews.index.tsx`)**:
    * Define the new route in the TanStack Router structure.
4. **Implement the UI**:
    * Build components in the feature folder using shared UI primitives from `src/components/ui`.
    * Use `useQuery` or `useMutation` for data fetching.
5. **Add Tests**:
    * Create `ReviewComponent.test.tsx` to verify the new functionality.

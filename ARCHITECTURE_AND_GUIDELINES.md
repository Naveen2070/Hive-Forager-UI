# Architecture & Development Guidelines

Welcome to the Frontend Service (`hive-forager`) of The Hive Project. This document outlines the architectural choices, design
patterns, engineering best practices, and development workflows used in this service. It serves as a guide for current
and future developers to understand how the system is built and how to contribute to it seamlessly.

---

## 1. Architectural Patterns

### 1.1. Feature-Driven Design (FDD)

The project follows a Feature-Driven Design pattern, where logic is modularized by domain rather than by technical type. This ensures that all components, hooks, and services related to a specific feature (e.g., "Auditoriums") are co-located.

* **`features/{feature-name}/components/`:** Presentational and container components specific to the feature.
* **`features/{feature-name}/hooks/`:** Custom hooks for data fetching (using TanStack Query) or complex UI logic.
* **`features/{feature-name}/services/`:** API call definitions specific to the feature.
* **`features/{feature-name}/types/`:** TypeScript interfaces and enums for the feature domain.

### 1.2. Separation of Concerns (UI vs. State)

We strictly separate the presentation layer from the state management and data-fetching logic.

* **Presentation:** Handled by React components using Tailwind CSS and Shadcn UI.
* **Server State:** Managed by **TanStack Query** (React Query). This handles caching, synchronization, and server-side state.
* **Client State:** Managed by **Zustand**. Used for global UI state like authentication, theme, or persistent user preferences.

---

## 2. Design Patterns

### 2.1. Container-Presenter Pattern

While modern React prefers hooks, we still utilize the spirit of the container-presenter pattern. Hooks act as "containers" that manage logic and data, providing it to "presenter" components that focus purely on rendering.

### 2.2. Custom Hook Pattern

Data fetching logic is never placed directly inside components. Instead, it is wrapped in custom hooks (e.g., `useGetEvents`, `useReserveSeats`) to promote reusability and testability.

### 2.3. Utility / Helper Pattern

Pure logic, formatting, and complex transformations are placed in `lib/` or `utils/` folders as standalone, exported functions that are easy to unit test.

---

## 3. Engineering Best Practices

### 3.1. Strict Type Safety

* **TypeScript Everywhere:** We avoid `any` at all costs. Every API response, component prop, and state slice must be strictly typed.
* **Type-Safe Routing:** Using **TanStack Router** to ensure that route parameters and navigation are verified at compile time.

### 3.2. Responsive & Accessible Design

* **Tailwind CSS:** Used for consistent, utility-first styling.
* **Radix UI / Shadcn:** Used for accessible, unstyled primitives to ensure the UI is usable by everyone.
* **Mobile First:** All features must be designed to work seamlessly on mobile devices, especially the QR scanner and booking flows.

### 3.3. Performance Optimization

* **Code Splitting:** Routes are lazily loaded to minimize the initial bundle size.
* **Query Invalidation:** Strategic use of `queryClient.invalidateQueries` to ensure data remains fresh without redundant network calls.
* **Memoization:** Use of `useMemo` and `useCallback` where necessary to prevent expensive re-renders in complex UI trees (like seat maps).

### 3.4. Component Composition

Prefer composition over deep prop drilling. Utilize Shadcn's primitive-based structure to build complex UI from simple, reusable blocks.

---

## 4. Testing Strategy

* **Unit Tests (`vitest`):** Focused on utility functions, state management logic, and individual hooks.
* **Component Tests (`React Testing Library`):** Verifying that components render correctly and handle user interactions as expected.
* **Integration Tests (`routes-test/`):** Testing the integration of multiple components and hooks within a specific route context.
* **Mocking (`msw` or internal mocks):** Using environment flags (`VITE_ENABLE_MOCK_AUTH`) to develop and test against consistent data sets.

---

## 5. How to Add a New Feature (Developer Guide)

If you need to add a new feature (e.g., "Event Reviews"), follow this workflow:

1. **Create the Feature Folder:** `src/features/reviews/`.
2. **Define Types:** Create `src/features/reviews/types.ts` based on the backend model.
3. **Implement Service:** Create `src/features/reviews/services/reviewService.ts` for API calls.
4. **Create Hooks:** Create `src/features/reviews/hooks/useReviews.ts` using TanStack Query.
5. **Build Components:** Create presentational components in `src/features/reviews/components/`.
6. **Define Route:** Add a new route in `src/routes/` and integrate the feature components.
7. **Write Tests:** Add unit and component tests to verify the new functionality.

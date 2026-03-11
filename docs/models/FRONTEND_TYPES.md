# Frontend Service - Data Models & Types Reference

This document provides a comprehensive reference of the TypeScript interfaces and enums used in the Frontend service. It
serves as a guide for understanding the data structures for API communication and state management.

---

## 1. Common & Enums

### Common Types

#### `PageResponse<T>`

Generic wrapper for paginated API responses used across the frontend.

| Field           | Type      | Description                    |
| :-------------- | :-------- | :----------------------------- |
| `content`       | `T[]`     | Array of data items.           |
| `pageNumber`    | `number`  | Current page index (0-based).  |
| `pageSize`      | `number`  | Number of items per page.      |
| `totalElements` | `number`  | Total items across all pages.  |
| `totalPages`    | `number`  | Total number of pages.         |
| `isLast`        | `boolean` | Whether this is the last page. |

#### `ApiError`

Standard structure for API error responses.

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `status`    | `number` | HTTP status code.                         |
| `error`     | `string` | HTTP status reason (e.g., "Bad Request"). |
| `message`   | `string` | Detailed error description.               |
| `path`      | `string` | API endpoint where error occurred.        |
| `timestamp` | `string` | ISO timestamp of the error.               |

### Enums

| Enum                   | Values                                                   | Description                                    |
| :--------------------- | :------------------------------------------------------- | :--------------------------------------------- |
| `UserRole`             | `USER`, `ORGANIZER`, `ADMIN`, `SUPER_ADMIN`              | System-wide user roles.                        |
| `EventStatus`          | `DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED`           | Lifecycle states for Events.                   |
| `BookingStatus`        | `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, ...         | Status of a booking/reservation.               |
| `ScanStatus`           | `idle`, `pending`, `success`, `error`, `already_scanned` | UI state for ticket scanning.                  |
| `CinemaApprovalStatus` | `PENDING`, `APPROVED`, `REJECTED`                        | Administrative status for Cinema registration. |
| `SeatStatus`           | `Available`, `Reserved`, `Sold`                          | Status of an individual seat in a showtime.    |
| `TicketStatus`         | `Pending`, `Confirmed`, `Used`, `Expired`, `Cancelled`   | Lifecycle state of a ticket.                   |

---

## 2. Auth & User

### `UserDTO`

| Field       | Type       | Description                 |
| :---------- | :--------- | :-------------------------- |
| `id`        | `string`   | Unique identifier.          |
| `fullName`  | `string`   | User's full name.           |
| `email`     | `string`   | User's email address.       |
| `role`      | `UserRole` | Assigned role.              |
| `createdAt` | `string`   | Account creation timestamp. |
| `isActive`  | `boolean`  | Account status.             |

### Auth Request/Response

| Interface               | Description                               |
| :---------------------- | :---------------------------------------- |
| `LoginRequest`          | Email and password for authentication.    |
| `RegisterUserRequest`   | Details for new user registration.        |
| `AuthResponse`          | JWT Token, Refresh Token, and User Email. |
| `ForgotPasswordRequest` | Email for password recovery.              |
| `ResetPasswordRequest`  | Token and new password for reset.         |

---

## 3. Cinema

### `CinemaResponse`

| Field            | Type                             | Description             |
| :--------------- | :------------------------------- | :---------------------- |
| `id`             | `string`                         | Primary Key.            |
| `name`           | `string`                         | Cinema Name.            |
| `location`       | `string`                         | Physical Address.       |
| `contactEmail`   | `string`                         | Contact Email.          |
| `approvalStatus` | `CinemaApprovalStatus \| string` | Current approval state. |

---

## 4. Movie

### `MovieResponse`

| Field             | Type      | Description         |
| :---------------- | :-------- | :------------------ |
| `id`              | `string`  | Primary Key.        |
| `title`           | `string`  | Movie Title.        |
| `description`     | `string`  | Synopsis.           |
| `durationMinutes` | `number`  | Runtime in minutes. |
| `releaseDate`     | `string`  | Release date.       |
| `posterUrl`       | `string?` | Optional image URL. |

---

## 5. Auditorium

### `AuditoriumResponse`

| Field        | Type                  | Description            |
| :----------- | :-------------------- | :--------------------- |
| `id`         | `string`              | Primary Key.           |
| `cinemaId`   | `string`              | Parent Cinema ID.      |
| `name`       | `string`              | Room/Screen name.      |
| `maxRows`    | `number`              | Grid height.           |
| `maxColumns` | `number`              | Grid width.            |
| `layout`     | `AuditoriumLayoutDTO` | Seating configuration. |

---

## 6. Showtime & Seating

### `ShowtimeResponse`

| Field          | Type     | Description            |
| :------------- | :------- | :--------------------- |
| `id`           | `string` | Primary Key.           |
| `movieId`      | `string` | Associated Movie.      |
| `auditoriumId` | `string` | Associated Auditorium. |
| `startTimeUtc` | `string` | Event start time.      |
| `basePrice`    | `number` | Base ticket price.     |

### Seating Types

| Interface                 | Description                                          |
| :------------------------ | :--------------------------------------------------- |
| `SeatCoordinateDTO`       | `{ row: number, col: number }`                       |
| `SeatTierDTO`             | Pricing group for a set of coordinates.              |
| `SeatStatusDTO`           | Status of a specific seat in the grid.               |
| `ShowtimeSeatMapResponse` | Full seating layout and availability for a showtime. |

---

## 7. Events & Ticket Tiers

### `EventDTO`

| Field           | Type              | Description                    |
| :-------------- | :---------------- | :----------------------------- |
| `id`            | `number`          | Primary Key.                   |
| `title`         | `string`          | Event Title.                   |
| `description`   | `string`          | Event Description.             |
| `startDate`     | `string`          | Start time.                    |
| `endDate`       | `string`          | End time.                      |
| `location`      | `string`          | Event Location.                |
| `ticketTiers`   | `TicketTierDTO[]` | Available pricing tiers.       |
| `status`        | `EventStatus`     | Current lifecycle state.       |
| `organizerName` | `string`          | Name of the organizing entity. |

### `TicketTierDTO`

| Field                 | Type     | Description                         |
| :-------------------- | :------- | :---------------------------------- |
| `id`                  | `number` | Primary Key.                        |
| `name`                | `string` | Tier name (e.g., "VIP", "General"). |
| `price`               | `number` | Price per ticket.                   |
| `totalAllocation`     | `number` | Total tickets available.            |
| `availableAllocation` | `number` | Remaining tickets.                  |

---

## 8. Booking & Checkout

### `BookingDTO`

| Field              | Type            | Description                        |
| :----------------- | :-------------- | :--------------------------------- |
| `bookingId`        | `number`        | Primary Key.                       |
| `bookingReference` | `string`        | Unique reference code.             |
| `eventTitle`       | `string`        | Title of the event.                |
| `eventDate`        | `string`        | Start time.                        |
| `ticketTierName`   | `string`        | Tier chosen by the user.           |
| `ticketsCount`     | `number`        | Number of tickets in this booking. |
| `totalPrice`       | `number`        | Total cost.                        |
| `status`           | `BookingStatus` | Current state of the booking.      |

### `MyTicketResponse`

| Field              | Type                     | Description           |
| :----------------- | :----------------------- | :-------------------- |
| `ticketId`         | `string`                 | Primary Key.          |
| `bookingReference` | `string`                 | Human-readable code.  |
| `movieTitle`       | `string`                 | Title of the movie.   |
| `cinemaName`       | `string`                 | Building Name.        |
| `auditoriumName`   | `string`                 | Screen Name.          |
| `startTimeUtc`     | `string`                 | Showtime start.       |
| `reservedSeats`    | `SeatCoordinateDTO[]`    | List of seats.        |
| `totalAmount`      | `number`                 | Total paid.           |
| `status`           | `TicketStatus \| string` | Current ticket state. |

### `CheckInResponse`

| Field            | Type      | Description                       |
| :--------------- | :-------- | :-------------------------------- |
| `success`        | `boolean` | Whether scan was successful.      |
| `status`         | `string`  | Result code (e.g., `CHECKED_IN`). |
| `attendeeName`   | `string?` | Ticket holder name.               |
| `ticketTierName` | `string?` | Assigned tier.                    |

---

## 9. Dashboard

### `DashboardStatsDTO`

| Field              | Type                 | Description                      |
| :----------------- | :------------------- | :------------------------------- |
| `totalRevenue`     | `number`             | Total lifetime revenue.          |
| `totalTicketsSold` | `number`             | Total tickets confirmed.         |
| `activeEvents`     | `number`             | Count of published events.       |
| `revenueTrend`     | `RevenueTrendItem[]` | Data for revenue chart.          |
| `recentSales`      | `RecentSale[]`       | List of the latest transactions. |

---

## 10. State Management (Zustand)

### `AuthState`

| Field             | Type              | Description                           |
| :---------------- | :---------------- | :------------------------------------ |
| `user`            | `UserDTO \| null` | Currently logged in user profile.     |
| `token`           | `string \| null`  | Bearer token for API authentication.  |
| `isAuthenticated` | `boolean`         | Flag indicating logged-in state.      |
| `setAuth`         | `Function`        | Updates user and token.               |
| `clearAuth`       | `Function`        | Resets store state.                   |
| `logout`          | `Function`        | Handles API logout and session clear. |

---

## 11. Utility & Local Mapper Types

### `DotNetPagedResponse<T>`

| Field           | Type      | Description                     |
| :-------------- | :-------- | :------------------------------ |
| `content`       | `T[]`     | List of items.                  |
| `pageNumber`    | `number`  | Current zero-based index.       |
| `pageSize`      | `number`  | Items per page.                 |
| `totalElements` | `number`  | Total items in DB.              |
| `totalPages`    | `number`  | Total pages available.          |
| `isLast`        | `boolean` | True if this is the final page. |

### `mapToPageResponse<T>`

Utility function in `pagination-mapper.ts` used to convert `DotNetPagedResponse` into the standard frontend
`PageResponse`.

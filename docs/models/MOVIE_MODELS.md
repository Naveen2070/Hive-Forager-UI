# Movie Service - Data Models Reference

This document provides a comprehensive reference of the Entities and Data Transfer Objects (DTOs) used in the Movie
Service. This can be used by other services in the Hive Project to understand the data structures for communication and
integration.

---

## 1. Entities

Entities represent the database schema and persistent data.

### `BaseAuditableEntity`

Common base class for all entities, providing auditing and soft-delete capabilities.

| Field          | Type        | Description                                |
| :------------- | :---------- | :----------------------------------------- |
| `Id`           | `Guid`      | Unique identifier (UUID v7)                |
| `CreatedAtUtc` | `DateTime`  | Timestamp of creation (UTC)                |
| `CreatedBy`    | `Long?`     | ID of the user who created the record      |
| `UpdatedAtUtc` | `DateTime?` | Timestamp of last update (UTC)             |
| `UpdatedBy`    | `Long?`     | ID of the user who last updated the record |
| `IsActive`     | `Boolean`   | Whether the record is currently active     |
| `IsDeleted`    | `Boolean`   | Whether the record is soft-deleted         |
| `DeletedAtUtc` | `DateTime?` | Timestamp of soft-deletion (UTC)           |
| `DeletedBy`    | `Long?`     | ID of the user who performed the deletion  |

### `Cinema`

| Field            | Type                   | Description                                        |
| :--------------- | :--------------------- | :------------------------------------------------- |
| `OrganizerId`    | `String`               | The ID of the user/organization owning this cinema |
| `Name`           | `String`               | Name of the cinema (Max 150 chars)                 |
| `Location`       | `String`               | Physical address or city (Max 500 chars)           |
| `ContactEmail`   | `String`               | Contact person's email (Max 255 chars)             |
| `ApprovalStatus` | `CinemaApprovalStatus` | `Pending`, `Approved`, or `Rejected`               |

### `Movie`

| Field             | Type       | Description                        |
| :---------------- | :--------- | :--------------------------------- |
| `Title`           | `String`   | Movie title (Max 255 chars)        |
| `Description`     | `String`   | Brief synopsis (Max 500 chars)     |
| `DurationMinutes` | `Int`      | Total runtime in minutes           |
| `ReleaseDate`     | `DateTime` | Global premiere date               |
| `PosterUrl`       | `String?`  | Optional URL to promotional poster |

### `Auditorium`

| Field                 | Type               | Description                                |
| :-------------------- | :----------------- | :----------------------------------------- |
| `CinemaId`            | `Guid`             | Foreign Key to parent Cinema               |
| `Name`                | `String`           | Name of the room/screen (Max 100 chars)    |
| `MaxRows`             | `Int`              | Total rows in the seating grid             |
| `MaxColumns`          | `Int`              | Total columns in the seating grid          |
| `LayoutConfiguration` | `AuditoriumLayout` | JSON object defining seating specificities |

### `Showtime`

| Field                   | Type        | Description                                     |
| :---------------------- | :---------- | :---------------------------------------------- |
| `MovieId`               | `Guid`      | Associated Movie                                |
| `AuditoriumId`          | `Guid`      | Associated Auditorium                           |
| `StartTimeUtc`          | `DateTime`  | Event start time                                |
| `BasePrice`             | `Decimal`   | Base price before seat surcharges               |
| `SeatAvailabilityState` | `ByteArray` | Binary map of statuses (0=Avail, 1=Res, 2=Sold) |
| `RowVersion`            | `ByteArray` | Concurrency token for optimistic locking        |

### `Ticket`

| Field              | Type                   | Description                                |
| :----------------- | :--------------------- | :----------------------------------------- |
| `UserId`           | `String`               | ID of the user who made the booking        |
| `ShowtimeId`       | `Guid`                 | Associated Showtime                        |
| `BookingReference` | `String`               | Human-readable code (e.g., "HIVE-XXXX")    |
| `ReservedSeats`    | `List<SeatCoordinate>` | Coordinates of reserved seats              |
| `TotalAmount`      | `Decimal`              | Total monetary cost                        |
| `Status`           | `TicketStatus`         | Lifecycle state (Pending, Confirmed, etc.) |
| `PaidAtUtc`        | `DateTime?`            | Payment confirmation timestamp             |

---

## 2. Data Transfer Objects (DTOs)

DTOs are used for API requests and responses.

### Cinema DTOs

#### `CinemaResponse`

| Field            | Type     | Description      |
| :--------------- | :------- | :--------------- |
| `Id`             | `Guid`   | Primary Key      |
| `Name`           | `String` | Cinema Name      |
| `Location`       | `String` | Physical Address |
| `ContactEmail`   | `String` | Contact Email    |
| `ApprovalStatus` | `String` | Status as string |

### Movie DTOs

#### `MovieResponse`

| Field             | Type       | Description    |
| :---------------- | :--------- | :------------- |
| `Id`              | `Guid`     | Primary Key    |
| `Title`           | `String`   | Movie Title    |
| `Description`     | `String`   | Movie Synopsis |
| `DurationMinutes` | `Int`      | Runtime        |
| `ReleaseDate`     | `DateTime` | Premiere Date  |
| `PosterUrl`       | `String?`  | Image URL      |

### Auditorium DTOs

#### `AuditoriumResponse`

| Field        | Type                  | Description        |
| :----------- | :-------------------- | :----------------- |
| `Id`         | `Guid`                | Primary Key        |
| `CinemaId`   | `Guid`                | Parent Cinema ID   |
| `Name`       | `String`              | Room Name          |
| `MaxRows`    | `Int`                 | Grid Height        |
| `MaxColumns` | `Int`                 | Grid Width         |
| `Layout`     | `AuditoriumLayoutDto` | JSON Seating Logic |

### Showtime & Seat Map DTOs

#### `ShowtimeSeatMapResponse`

| Field            | Type                  | Description                      |
| :--------------- | :-------------------- | :------------------------------- |
| `MovieTitle`     | `String`              | Title of movie playing           |
| `CinemaName`     | `String`              | Building Name                    |
| `AuditoriumName` | `String`              | Screen Name                      |
| `MaxRows`        | `Int`                 | Seating Height                   |
| `MaxColumns`     | `Int`                 | Seating Width                    |
| `BasePrice`      | `Decimal`             | Base price                       |
| `Tiers`          | `List<SeatTierDto>`   | Custom pricing groups            |
| `SeatMap`        | `List<SeatStatusDto>` | Status of every seat in the grid |

### Ticket & Booking DTOs

#### `MyTicketResponse`

| Field              | Type                      | Description         |
| :----------------- | :------------------------ | :------------------ |
| `TicketId`         | `Guid`                    | Primary Key         |
| `BookingReference` | `String`                  | Human-readable code |
| `MovieTitle`       | `String`                  | Movie Title         |
| `CinemaName`       | `String`                  | Cinema Name         |
| `AuditoriumName`   | `String`                  | Room Name           |
| `StartTimeUtc`     | `DateTime`                | Start time          |
| `ReservedSeats`    | `List<SeatCoordinateDto>` | Selections          |
| `TotalAmount`      | `Decimal`                 | Paid Amount         |
| `Status`           | `String`                  | Current State       |

#### `CheckInResponse`

| Field            | Type     | Description                             |
| :--------------- | :------- | :-------------------------------------- |
| `Status`         | `String` | Scan result (CHECKED_IN, EXPIRED, etc.) |
| `AttendeeName`   | `String` | Ticket holder name                      |
| `TicketTierName` | `String` | Assigned seating tier                   |

---

## 3. Enums & Constants

### `TicketStatus`

| Value       | Description                            |
| :---------- | :------------------------------------- |
| `Pending`   | Seats are locked; waiting for payment. |
| `Confirmed` | Payment verified; ticket is active.    |
| `Used`      | Scanned at the entrance.               |
| `Expired`   | Showtime has passed.                   |
| `Cancelled` | Reservation was released.              |

### `CinemaApprovalStatus`

| Value      | Description                        |
| :--------- | :--------------------------------- |
| `Pending`  | New registration; awaiting review. |
| `Approved` | Cinema is live and active.         |
| `Rejected` | Denied by administration.          |

### `SeatStatus`

This is a `byte`-based enum used by the `SeatMapEngine`.

| Value | Name        | Description                             |
| :---- | :---------- | :-------------------------------------- |
| `0`   | `Available` | Open for reservation.                   |
| `1`   | `Reserved`  | Locked in a pending transaction.        |
| `2`   | `Sold`      | Permanently occupied for the showtime.  |
| `3`   | `Broken`    | Not available for sale (e.g., damaged). |

---

## 4. Business Logic Helpers

### `SeatMapEngine`

High-performance, zero-allocation struct for managing seating grids.

**Key Operations:**

- `TryReserveSeats(List<SeatCoordinate>)`: Atomic verification and locking.
- `ReleaseSeat(SeatCoordinate)`: Unlocks a seat back to `Available`.
- `MarkAsSold(List<SeatCoordinate>)`: Finalizes a reservation.

---

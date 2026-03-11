# Event Service - Data Models Reference

This document provides a comprehensive reference of the Entities and Data Transfer Objects (DTOs) used in the Event
Service. This can be used by other services and the UI in the Hive Project to understand the data structures for
communication and
integration.

---

## 1. Entities

Entities represent the database schema and persistent data.

### `AuditableEntity` (Base Class)

_Package: `com.thehiveproject.event.infrastructure.persistence.base`_

Common base class for all entities, providing auditing and soft-delete capabilities.

| Field       | Type       | Description                                |
| :---------- | :--------- | :----------------------------------------- |
| `createdAt` | `Instant`  | Timestamp of creation                      |
| `updatedAt` | `Instant`  | Timestamp of last update                   |
| `version`   | `Long`     | Optimistic locking version                 |
| `isDeleted` | `Boolean`  | Whether the record is soft-deleted         |
| `deletedAt` | `Instant?` | Timestamp of soft-deletion                 |
| `deletedBy` | `Long?`    | ID of the user who soft-deleted the record |

### `EventEntity`

_Package: `com.thehiveproject.event.infrastructure.persistence.event`_

| Field         | Type                      | Description                                          |
| :------------ | :------------------------ | :--------------------------------------------------- |
| `id`          | `Long?`                   | Primary Key (Identity)                               |
| `title`       | `String`                  | Event title                                          |
| `description` | `String`                  | Detailed description                                 |
| `startDate`   | `LocalDateTime`           | Event start date and time                            |
| `endDate`     | `LocalDateTime`           | Event end date and time                              |
| `location`    | `String`                  | Event venue/location                                 |
| `ticketTiers` | `MutableList<TicketTier>` | One-to-many relationship with `TicketTierEntity`     |
| `status`      | `EventStatus`             | Enum: `DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED` |
| `organizerId` | `Long`                    | ID of the user who owns the event                    |

### `TicketTierEntity`

_Package: `com.thehiveproject.event.infrastructure.persistence.event`_

| Field                 | Type            | Description                           |
| :-------------------- | :-------------- | :------------------------------------ |
| `id`                  | `Long?`         | Primary Key (Identity)                |
| `name`                | `String`        | Tier name (e.g., "VIP", "General")    |
| `price`               | `BigDecimal`    | Ticket price                          |
| `totalAllocation`     | `Int`           | Total tickets available for this tier |
| `availableAllocation` | `Int`           | Remaining tickets                     |
| `validFrom`           | `LocalDateTime` | When sales start                      |
| `validUntil`          | `LocalDateTime` | When sales end                        |
| `event`               | `EventEntity`   | Reference to the parent Event         |

### `BookingEntity`

_Package: `com.thehiveproject.event.infrastructure.persistence.booking`_

| Field              | Type               | Description                                                   |
| :----------------- | :----------------- | :------------------------------------------------------------ |
| `id`               | `Long?`            | Primary Key (Identity)                                        |
| `bookingReference` | `String`           | Unique alphanumeric reference                                 |
| `userId`           | `Long`             | ID of the user who made the booking                           |
| `event`            | `EventEntity`      | Reference to Event                                            |
| `ticketTier`       | `TicketTierEntity` | Reference to specific Ticket Tier                             |
| `ticketsCount`     | `Int`              | Number of tickets in this booking                             |
| `totalPrice`       | `BigDecimal`       | Total price paid                                              |
| `status`           | `BookingStatus`    | Enum: `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUNDED` |
| `lastCheckedInAt`  | `Instant?`         | Timestamp of last check-in                                    |
| `checkInCount`     | `Int`              | Number of times this booking was checked in                   |

---

## 2. Enums & Constants

### `EventStatus`

| Value       | Description                                      |
| :---------- | :----------------------------------------------- |
| `DRAFT`     | Event is being edited and not visible to public. |
| `PUBLISHED` | Event is live and tickets can be booked.         |
| `CANCELLED` | Event has been cancelled by organizer.           |
| `COMPLETED` | Event date has passed.                           |

### `BookingStatus`

| Value             | Description                                      |
| :---------------- | :----------------------------------------------- |
| `PENDING_PAYMENT` | Initial state, waiting for payment confirmation. |
| `CONFIRMED`       | Payment successful, booking is active.           |
| `CANCELLED`       | Booking cancelled by user or system.             |
| `REFUNDED`        | Payment returned to user.                        |
| `EXPIRED`         | Payment window timed out.                        |
| `CHECKED_IN`      | User has entered the venue.                      |

### `CheckInStatus`

| Value                | Description                                      |
| :------------------- | :----------------------------------------------- |
| `CHECKED_IN`         | Success.                                         |
| `ALREADY_CHECKED_IN` | Ticket was already scanned.                      |
| `EXPIRED`            | Event has already ended.                         |
| `INVALID_STATUS`     | Booking is not in CONFIRMED state.               |
| `WRONG_DATE`         | Ticket is for a different date.                  |
| `NOT_AUTHORIZED`     | Scanner does not have permission for this event. |

---

## 3. Data Transfer Objects (DTOs)

### Event DTOs

#### `EventDTO`

_Package: `com.thehiveproject.event.api.dto`_

| Field           | Type                  | Description                                |
| :-------------- | :-------------------- | :----------------------------------------- |
| `id`            | `Long`                | ID                                         |
| `title`         | `String`              | Title                                      |
| `description`   | `String`              | Description                                |
| `startDate`     | `LocalDateTime`       | Start date                                 |
| `endDate`       | `LocalDateTime`       | End date                                   |
| `location`      | `String`              | Location                                   |
| `ticketTiers`   | `List<TicketTierDTO>` | List of tiers                              |
| `priceRange`    | `String`              | Formatted price range (e.g., "$10 - $100") |
| `status`        | `EventStatus`         | Status                                     |
| `organizerId`   | `String`              | Organizer ID as String                     |
| `organizerName` | `String`              | Organizer full name                        |
| `createdAt`     | `Instant`             | Creation timestamp                         |

#### `CreateEventRequest`

| Field            | Type                            | Description       |
| :--------------- | :------------------------------ | :---------------- |
| `title`          | `String`                        | Required          |
| `description`    | `String`                        | Required          |
| `startDate`      | `LocalDateTime`                 | Required          |
| `endDate`        | `LocalDateTime`                 | Required          |
| `location`       | `String`                        | Required          |
| `ticketTiers`    | `List<CreateTicketTierRequest>` | At least one      |
| `organizerEmail` | `String`                        | Organizer's email |

#### `UpdateEventRequest`

| Field         | Type             | Description |
| :------------ | :--------------- | :---------- |
| `title`       | `String?`        | Optional    |
| `description` | `String?`        | Optional    |
| `location`    | `String?`        | Optional    |
| `startDate`   | `LocalDateTime?` | Optional    |
| `endDate`     | `LocalDateTime?` | Optional    |

#### `EventSearchCriteria`

| Field       | Type             | Description          |
| :---------- | :--------------- | :------------------- |
| `title`     | `String?`        | Filter by title      |
| `location`  | `String?`        | Filter by locale     |
| `minPrice`  | `BigDecimal?`    | Price floor          |
| `maxPrice`  | `BigDecimal?`    | Price ceiling        |
| `startDate` | `LocalDateTime?` | Date floor           |
| `endDate`   | `LocalDateTime?` | Date ceiling         |
| `status`    | `String?`        | Default: `PUBLISHED` |

### Ticket Tier DTOs

#### `TicketTierDTO`

| Field                 | Type            | Description |
| :-------------------- | :-------------- | :---------- |
| `id`                  | `Long`          | ID          |
| `name`                | `String`        | Name        |
| `price`               | `BigDecimal`    | Price       |
| `totalAllocation`     | `Int`           | Total       |
| `availableAllocation` | `Int`           | Remaining   |
| `validFrom`           | `LocalDateTime` | Start Date  |
| `validUntil`          | `LocalDateTime` | End Date    |

#### `CreateTicketTierRequest`

| Field             | Type            | Description |
| :---------------- | :-------------- | :---------- |
| `name`            | `String`        | Required    |
| `price`           | `BigDecimal`    | Min: 0      |
| `totalAllocation` | `Int`           | Min: 1      |
| `validFrom`       | `LocalDateTime` | Required    |
| `validUntil`      | `LocalDateTime` | Required    |

### Booking DTOs

#### `BookingDTO`

| Field              | Type            | Description |
| :----------------- | :-------------- | :---------- |
| `bookingId`        | `Long`          | ID          |
| `bookingReference` | `String`        | Ref Code    |
| `eventId`          | `Long`          | Event ID    |
| `eventTitle`       | `String`        | Event Title |
| `ticketTierName`   | `String`        | Tier Name   |
| `eventLocation`    | `String`        | Location    |
| `ticketsCount`     | `Int`           | Count       |
| `totalPrice`       | `BigDecimal`    | Total       |
| `status`           | `BookingStatus` | Status      |
| `bookedAt`         | `Instant`       | Timestamp   |

#### `CreateBookingRequest`

| Field          | Type   | Description     |
| :------------- | :----- | :-------------- |
| `eventId`      | `Long` | Required        |
| `ticketTierId` | `Long` | Required        |
| `ticketsCount` | `Int`  | Min: 1, Max: 10 |

#### `CheckInResponse`

| Field            | Type            | Description         |
| :--------------- | :-------------- | :------------------ |
| `success`        | `Boolean`       | Success status      |
| `status`         | `CheckInStatus` | `SUCCESS`, `FAILED` |
| `message`        | `String`        | Status message      |
| `attendeeName`   | `String?`       | User name           |
| `ticketTierName` | `String?`       | Tier used           |
| `timestamp`      | `LocalDateTime` | Check-in time       |

### Dashboard DTOs

#### `DashboardStatsDTO`

| Field                          | Type                     | Description |
| :----------------------------- | :----------------------- | :---------- |
| `totalRevenue`                 | `Double`                 | Total       |
| `totalTicketsSold`             | `Long`                   | Total       |
| `activeEvents`                 | `Long`                   | Count       |
| `revenueGrowthLastWeekPercent` | `Double`                 | Trend       |
| `revenueTrend`                 | `List<RevenueTrendItem>` | Chart Data  |
| `recentSales`                  | `List<RecentSaleDTO>`    | Latest list |

### Common DTOs

#### `PaginatedResponse<T>`

| Field           | Type      | Description   |
| :-------------- | :-------- | :------------ |
| `content`       | `List<T>` | Data list     |
| `pageNumber`    | `Int`     | Current page  |
| `pageSize`      | `Int`     | Page size     |
| `totalElements` | `Long`    | Total records |
| `totalPages`    | `Int`     | Total pages   |
| `isLast`        | `Boolean` | End of list?  |

#### `UserSummaryDTO`

| Field      | Type     | Description |
| :--------- | :------- | :---------- |
| `id`       | `Long`   | User ID     |
| `fullName` | `String` | Full Name   |
| `email`    | `String` | Email       |

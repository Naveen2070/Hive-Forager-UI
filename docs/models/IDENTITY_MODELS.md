# Identity Service - Data Models Reference

This document provides a comprehensive reference of the Entities and Data Transfer Objects (DTOs) used in the Identity
Service. This can be used by other services in the Hive Project to understand the data structures for communication and
integration.

---

## 1. Entities

Entities represent the database schema and persistent data.

### `BaseEntity`

_Package: `com.thehiveproject.identity_service.common.entity`_

Common base class for all entities, providing auditing and soft-delete capabilities.

| Field       | Type             | Description                                         |
| :---------- | :--------------- | :-------------------------------------------------- |
| `id`        | `Long?` / `Int?` | Unique identifier (TSID for Long, Identity for Int) |
| `createdBy` | `Long?`          | ID of the user who created the record               |
| `updatedBy` | `Long?`          | ID of the user who last updated the record          |
| `deletedBy` | `Long?`          | ID of the user who soft-deleted the record          |
| `createdAt` | `Instant`        | Timestamp of creation                               |
| `updatedAt` | `Instant`        | Timestamp of last update                            |
| `version`   | `Long`           | Optimistic locking version                          |
| `active`    | `Boolean`        | Whether the record is active                        |
| `deleted`   | `Boolean`        | Whether the record is soft-deleted                  |
| `deletedAt` | `Instant?`       | Timestamp of soft-deletion                          |

### `User`

_Package: `com.thehiveproject.identity_service.user.entity`_

| Field          | Type                   | Description                              |
| :------------- | :--------------------- | :--------------------------------------- |
| `id`           | `Long?`                | Primary Key (TSID)                       |
| `email`        | `String`               | Unique email address                     |
| `passwordHash` | `String`               | Hashed password                          |
| `fullName`     | `String`               | User's full name                         |
| `domainAccess` | `List<String>`         | List of domains the user has access to   |
| `roles`        | `MutableSet<UserRole>` | One-to-many relationship with `UserRole` |

### `Role`

_Package: `com.thehiveproject.identity_service.user.entity`_

| Field  | Type     | Description                              |
| :----- | :------- | :--------------------------------------- |
| `id`   | `Int?`   | Primary Key (Auto-increment)             |
| `name` | `String` | Unique role name (e.g., "USER", "ADMIN") |

### `UserRole`

_Package: `com.thehiveproject.identity_service.user.entity`_

Join table entity for User-Role relationship with Domain support.

| Field    | Type     | Description                                           |
| :------- | :------- | :---------------------------------------------------- |
| `id`     | `Long?`  | Primary Key (TSID)                                    |
| `user`   | `User`   | Reference to User                                     |
| `role`   | `Role`   | Reference to Role                                     |
| `domain` | `String` | Specific domain this role applies to (e.g., "events") |

### `RefreshToken`

_Package: `com.thehiveproject.identity_service.auth.entity`_

Used for issuing new access tokens without re-authentication.

| Field        | Type      | Description               |
| :----------- | :-------- | :------------------------ |
| `id`         | `Long?`   | Primary Key (TSID)        |
| `user`       | `User`    | Reference to User         |
| `token`      | `String`  | Unique refresh token UUID |
| `expiryDate` | `Instant` | Expiration timestamp      |

### `PasswordResetToken`

_Package: `com.thehiveproject.identity_service.auth.entity`_

Temporary token for secure password recovery.

| Field        | Type      | Description             |
| :----------- | :-------- | :---------------------- |
| `id`         | `Long?`   | Primary Key (TSID)      |
| `user`       | `User`    | Reference to User       |
| `token`      | `String`  | Unique reset token UUID |
| `expiryDate` | `Instant` | Expiration timestamp    |

---

## 2. Data Transfer Objects (DTOs)

DTOs are used for API requests and responses.

### Auth DTOs

#### `AuthResponse`

Response sent after successful login or token refresh.

| Field          | Type     | Description                                                    |
| :------------- | :------- | :------------------------------------------------------------- |
| `token`        | `String` | JWT access token (Contains `domains` and `permissions` claims) |
| `refreshToken` | `String` | Refresh token UUID                                             |
| `email`        | `String` | Authenticated user email                                       |

#### `LoginRequest`

Payload for user authentication.

| Field      | Type     | Description        |
| :--------- | :------- | :----------------- |
| `email`    | `String` | User email address |
| `password` | `String` | User password      |

#### `RegisterRequest` / `CreateUserRequest`

Payload for user registration or admin creation.

| Field         | Type                  | Description                                                    |
| :------------ | :-------------------- | :------------------------------------------------------------- |
| `fullName`    | `String`              | User's full name                                               |
| `email`       | `String`              | User's email                                                   |
| `password`    | `String`              | User's password (min 8 chars)                                  |
| `domainRoles` | `Map<String, String>` | Map of domains to requested roles (e.g., `{"events": "USER"}`) |

#### `ForgotPasswordRequest`

Request to initiate password recovery.

| Field   | Type     | Description                  |
| :------ | :------- | :--------------------------- |
| `email` | `String` | Email address of the account |

#### `ResetPasswordRequest`

Payload to complete password recovery.

| Field         | Type     | Description                    |
| :------------ | :------- | :----------------------------- |
| `token`       | `String` | Reset token received via email |
| `newPassword` | `String` | New password (min 8 chars)     |

#### `TokenRefreshRequest`

Request for a new access token using a refresh token.

| Field          | Type     | Description                  |
| :------------- | :------- | :--------------------------- |
| `refreshToken` | `String` | The valid refresh token UUID |

---

### User DTOs

#### `UserResponse`

Standard user profile response.

| Field         | Type                        | Description             |
| :------------ | :-------------------------- | :---------------------- |
| `id`          | `String`                    | TSID as String          |
| `fullName`    | `String`                    | User's full name        |
| `email`       | `String`                    | User's email            |
| `domainRoles` | `Map<String, List<String>>` | Roles grouped by domain |
| `createdAt`   | `Instant`                   | Creation timestamp      |
| `isActive`    | `Boolean`                   | Account status          |

#### `UserDto`

Comprehensive DTO containing full entity state.

| Field   | Type               | Description                            |
| :------ | :----------------- | :------------------------------------- |
| `id`    | `String?`          | ID                                     |
| `email` | `String?`          | Email                                  |
| `roles` | `Set<UserRoleDto>` | Nested role details including `domain` |

#### `UserRoleDto` (Nested in `UserDto`)

| Field      | Type      | Description       |
| :--------- | :-------- | :---------------- |
| `roleName` | `String?` | Role name         |
| `domain`   | `String?` | Associated domain |

#### `UserSummary`

Lightweight user identification.

| Field      | Type     | Description      |
| :--------- | :------- | :--------------- |
| `id`       | `Long`   | User ID (TSID)   |
| `fullName` | `String` | User's full name |
| `email`    | `String` | User's email     |

#### `UpdateProfileRequest`

Payload for updating user profile details.

| Field      | Type      | Description      |
| :--------- | :-------- | :--------------- |
| `fullName` | `String?` | User's full name |

#### `ChangePasswordRequest`

Payload for changing authenticated user's password.

| Field         | Type     | Description      |
| :------------ | :------- | :--------------- |
| `oldPassword` | `String` | Current password |
| `newPassword` | `String` | New password     |

---

### Common DTOs

#### `PaginatedResponse<T>`

Generic wrapper for paginated lists.

| Field           | Type      | Description                    |
| :-------------- | :-------- | :----------------------------- |
| `content`       | `List<T>` | List of items for current page |
| `page`          | `Int`     | Current page index (0-based)   |
| `size`          | `Int`     | Page size                      |
| `totalElements` | `Long`    | Total number of records        |
| `totalPages`    | `Int`     | Total number of pages          |
| `isLast`        | `Boolean` | Whether this is the last page  |

#### `ApiErrorResponse`

Standard error structure for all failed requests.

| Field       | Type            | Description                   |
| :---------- | :-------------- | :---------------------------- |
| `timestamp` | `LocalDateTime` | When the error occurred       |
| `status`    | `Int`           | HTTP status code              |
| `error`     | `String`        | HTTP status reason            |
| `message`   | `String`        | Detailed error message        |
| `path`      | `String`        | Endpoint where error occurred |

---

## 3. Domains & Roles

### Available Domains

| Domain   | Description                           |
| :------- | :------------------------------------ |
| `events` | Core Event Management ecosystem.      |
| `movies` | Cinema and Ticketing ecosystem.       |
| `admin`  | Platform-wide administrative control. |

### Standard Roles

Roles are typically prefixed with `ROLE_` when used in JWT claims or internal security checks.

| Role          | Description                                               |
| :------------ | :-------------------------------------------------------- |
| `USER`        | Standard consumer access.                                 |
| `ORGANIZER`   | Entity that creates and manages content (Events/Cinemas). |
| `ADMIN`       | Domain-specific administrator.                            |
| `SUPER_ADMIN` | Platform-wide global administrator.                       |

---

## 4. Security Utilities

### S2S HMAC Verification (`S2SAuthUtil`)

Used for secure internal service-to-service calls.

**Signature Formula:**
`Base64(HMAC-SHA256(serviceId + ":" + timestamp, sharedSecret))`

**Parameters:**

- `serviceId`: String (e.g., "event-service")
- `timestamp`: Long (Epoch seconds)
- `sharedSecret`: String (Shared between services)

---

## 5. Token Claim Structure

The Identity Service issues JWT access tokens with a multi-tenant permission model.

### Standard Claims

| Claim | Description |
| :---- | :---------- |
| `sub` | User Email  |
| `iat` | Issued At   |
| `exp` | Expiration  |

### Custom Claims

| Claim         | Type                        | Description                                        |
| :------------ | :-------------------------- | :------------------------------------------------- |
| `id`          | `Long`                      | User unique identifier (TSID)                      |
| `email`       | `String`                    | Redundant email claim for convenience              |
| `domains`     | `List<String>`              | List of domains the user has access to             |
| `permissions` | `Map<String, List<String>>` | Map of domains to list of roles (e.g. `ROLE_USER`) |

Example `permissions` claim:

```json
{
  "events": ["ROLE_ORGANIZER", "ROLE_USER"],
  "admin": ["ROLE_ADMIN"]
}
```

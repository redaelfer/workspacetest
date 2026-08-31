# Sign-in backend contract

This repository does not currently include an application backend framework, routing layer, database model, session store, or external authentication integration. Until those pieces exist, backend support for the sign-in page is defined as a small implementation contract rather than a partial credential system.

## Scope

Provide a future server-side surface for sign-in without collecting credentials in this placeholder repository.

## Reserved endpoints

| Method | Path | Purpose | Current status |
| --- | --- | --- | --- |
| `GET` | `/auth/sign-in` | Return sign-in capability metadata or route to the sign-in experience. | Reserved; not implemented. |
| `POST` | `/auth/sign-in` | Accept validated credentials only after an approved auth provider, user store, password hashing strategy, rate limiting, and session/token policy exist. | Reserved; not implemented. |
| `POST` | `/auth/sign-out` | End the current authenticated session when session handling exists. | Reserved; not implemented. |

## Future `POST /auth/sign-in` request

When a backend framework is added, the request body should be JSON and intentionally small:

```json
{
  "email": "user@example.com",
  "password": "user supplied password"
}
```

Validation requirements before authentication:

- Require HTTPS in deployed environments.
- Reject non-JSON request bodies.
- Normalize and validate email format server-side.
- Enforce length limits before any password verification work.
- Apply rate limiting by account and client origin.
- Return generic authentication errors so account existence is not disclosed.

## Future success response

A successful sign-in should return only non-sensitive session state needed by the UI:

```json
{
  "user": {
    "id": "stable-user-id",
    "email": "user@example.com"
  },
  "authenticated": true
}
```

Session identifiers or tokens should be transported using the repository's future approved session mechanism, preferably secure, HTTP-only cookies for browser sign-in. Do not expose raw secrets in JSON responses.

## Future error response

Authentication failures should use a generic message:

```json
{
  "error": "Invalid email or password"
}
```

Use `401 Unauthorized` for invalid credentials, `400 Bad Request` for malformed requests, and `429 Too Many Requests` for rate limits.

## Non-goals for this repository state

- No password storage or hashing is added here.
- No token issuance is added here.
- No external auth provider calls are added here.
- No frontend sign-in UI files are added or modified here.

## Implementation checklist for a future backend

1. Choose the backend framework and auth/session strategy.
2. Add a user store and password hashing or external identity provider integration.
3. Add CSRF, rate limiting, audit logging, and secure cookie/session settings.
4. Add automated tests for success, failure, malformed requests, and rate limits.
5. Wire the sign-in UI to the backend endpoint only after the backend tests pass.

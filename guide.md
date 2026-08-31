# Project guide

## Login page backend integration notes

This repository currently contains documentation placeholders only; it does not include an application backend, auth provider, session store, database, or token service. These notes define the backend contract that a future login page should integrate with, without scaffolding a framework or collecting credentials in this repository.

### Endpoint

- `POST /auth/login`
- Request format: JSON only.
- Response format: JSON plus a secure session mechanism chosen by the future backend.

### Accepted input fields

```json
{
  "email": "user@example.com",
  "password": "user supplied password",
  "remember": false
}
```

- `email` is required.
- `password` is required.
- `remember` is optional and defaults to `false`; it may extend the session lifetime only if the future auth policy allows persistent sessions.

### Validation rules

Before any credential verification, the backend should:

- Reject non-JSON requests with `415 Unsupported Media Type`.
- Require `email` and `password` fields.
- Trim and normalize `email` for comparison while preserving the canonical stored value.
- Validate that `email` is syntactically plausible and within the backend's length limit.
- Enforce a password length limit before hashing or provider calls.
- Treat missing, malformed, or wrong-type fields as `400 Bad Request`.
- Never perform client-side-only validation as the source of truth.

### Success response and session behavior

On successful login, the backend should create or refresh the user's authenticated session and return only non-sensitive account state needed by the page:

```json
{
  "authenticated": true,
  "user": {
    "id": "stable-user-id",
    "email": "user@example.com"
  },
  "redirectTo": "/"
}
```

Session identifiers, refresh tokens, or equivalent secrets should be delivered through the future backend's approved secure mechanism. For browser login, prefer `Secure`, `HttpOnly`, `SameSite` cookies so the page does not handle raw session secrets.

### Failure cases

| Case | Status | Response |
| --- | --- | --- |
| Non-JSON request | `415` | `{ "error": "Unsupported content type" }` |
| Missing or malformed fields | `400` | `{ "error": "Enter a valid email and password" }` |
| Invalid credentials | `401` | `{ "error": "Invalid email or password" }` |
| Too many attempts | `429` | `{ "error": "Too many login attempts. Try again later" }` |
| Unexpected server/auth provider failure | `500` | `{ "error": "Login is temporarily unavailable" }` |

Invalid credential responses must not reveal whether the email address exists.

### Security notes

- Do not log plaintext passwords, request bodies containing passwords, session tokens, or auth provider secrets.
- Rate-limit login attempts by account identifier and client origin before credential verification.
- Use constant-time password hash verification when the backend owns password authentication.
- Store password hashes only with an approved slow hashing algorithm; never store plaintext passwords.
- Use CSRF protection for cookie-based browser sessions.
- Mark session cookies `Secure`, `HttpOnly`, and an appropriate `SameSite` value.
- Rotate or invalidate sessions on logout, password reset, and suspicious activity.
- Add automated tests for validation, success, invalid credentials, rate limiting, and non-disclosure of account existence when a backend framework is introduced.

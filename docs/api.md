# API

Base `/api/v1`, envelope `{success, data, error}`.

* `GET /health` → `{ok:true}`
* `POST /auth/register {email,password}` → `{user, tokens}` (argon2id, 201; 409 EMAIL_TAKEN)
* `POST /auth/login` → `{user, tokens}` (401 INVALID_CREDENTIALS)
* `POST /auth/refresh {refreshToken}` → rotated `{accessToken, refreshToken}` (401 INVALID_REFRESH)
* `GET /auth/me` (Bearer) → `{id,email}`
* `GET /notes`, `GET /notes/:id`, `POST /notes {id UUID,...}`, `PATCH /notes/:id {..., version?}`, `DELETE /notes/:id` (soft; 404 NOTE_NOT_FOUND; 409 VERSION_CONFLICT)
* `GET/POST /labels`, `PATCH /labels/:id`, `DELETE /labels/:id`
* `POST /sync {deviceId, lastSyncAt, operations[500]}` → `{acceptedOperations, changes, serverTime}` (400 INVALID_SYNC)

Auth: access 15m + refresh 30d JWT, refresh stored as SHA-256 with rotation/revocation. Rate-limit 200/min, CORS from `CORS_ORIGIN`, SecureStore on device (never AsyncStorage).

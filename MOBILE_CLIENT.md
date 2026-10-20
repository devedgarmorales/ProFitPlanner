# Run the client companion app

The existing bare React Native app now connects clients to their assigned routines and records real workout sessions. It keeps the existing React Native 0.75 / React 18 stack; this change does not migrate to Expo or upgrade the native runtime.

## Quick start

1. Apply the matching Django workout-session migration and deploy the matching API before testing mobile sync.
2. Configure `.env` locally (never commit credentials):

   ```dotenv
   BASE_URL_API=https://your-api.example/api/
   ```

   Android emulator development usually uses `http://10.0.2.2:8000/api/`; an iOS simulator can use `http://127.0.0.1:8000/api/`. A physical device needs a reachable development host. Plain HTTP is for development only; release Android disables cleartext traffic.
3. Rebuild the **native** app using the project's existing Android/iOS toolchains. A Metro reload alone cannot register the new secure-storage bridge. On iOS, run `cd ios && pod install --no-repo-update` after applying these changes, even if the workspace already existed, to regenerate Pods and autolinking.
4. Sign in with an active **client** membership. The app shows current assignments from that organization and preserves separate workout caches for each user/organization.

## Client flow

`Sign in (including MFA when enabled) → organization → routines → day → training → summary/history`

- Coach prescriptions are read-only. The client records actual reps, weight, completed sets and notes; no exercise replacement/deletion controls remain.
- Every valid edit is persisted synchronously to the device before it is shown as recorded. Invalid numeric input is identified and the last valid value remains saved.
- One local session can be in progress per user/organization. Starting another day resumes that session instead of discarding it.
- Rest and elapsed time use timestamps, so backgrounding does not reset them.
- Completed sessions are read-only. History includes exercise names and weight units. The recent-load summary compares the same canonical exercise and unit across the last two completed sessions, without mixing kilograms/pounds or inventing a prior result.

## Persistence and sync

| Area | Behavior |
|---|---|
| Credentials | iOS Keychain / Android Keystore-backed native storage; no plaintext token fallback |
| Legacy login | Old MMKV `auth_tokens` is deliberately deleted; existing installations must sign in again |
| Workout cache | Synchronous MMKV data, namespaced by user and organization; tokens are never written here |
| Offline | Cached assignments and existing training remain usable; expired cached routines cannot start new sessions |
| Queue | Full-session `PUT` with a client UUID; a single-flight queue sends snapshots in order, acknowledges only matching revisions, and performs at most two passes per trigger |
| Retry | Edits debounce a sync; foreground/background transitions, completion and manual sync also trigger attempts |
| Failure | A failed request leaves the local snapshot pending; no false synced confirmation |
| Logout | Clears secure credentials and visible identity, not scoped workout history; unsynced work reappears only after the same account/organization signs in again |

Workout caches and cached profile information are device-sandboxed MMKV data, **not application-level encrypted health-data storage**. Device backup, retention, shared-device and encryption policy need product/security approval before production distribution. Offline logout cannot guarantee immediate server-side refresh-token revocation; local credentials are still removed.

## API contract

- `POST token/`, optional `POST auth/mfa/verify-login/`, `POST token/refresh/`, `POST token/revoke/`.
- `GET tenants/memberships/`, then `GET auth/user/` with organization context.
- `GET routines/routines/assigned/`: client-only current routines with coach and nested days/exercises/sets.
- `PUT routines/workout-sessions/{client-uuid}/`: idempotent full snapshot, mutable while in progress; completed snapshots accept only identical retries.
- `GET routines/workout-sessions/`: scoped history, including preserved exercise metadata.

Authenticated organization requests use `X-Organization`. The client understands the backend `status/data` envelope and follows every history page without forwarding credentials to a server-supplied pagination host. Network-only token refresh failures retain credentials; revoked/expired credentials return the user to login while preserving workout data.

## Verification

```sh
npm run typecheck
npm run lint:client
npm run test:client
```

Tests cover secure storage, session refresh, account-cache isolation, scope changes, full pagination, persistence before failed sync, queue serialization/retry/revisions, routine validity and canonical exercise progression. App/login rendering tests mock native providers; they are **not** device end-to-end tests.

The old routine mock screens, prescription-editing flow and superseded navigation were removed. Other legacy folder/profile/auth files remain outside the active navigation. `lint:client` intentionally covers the active client graph; legacy repository-wide lint cleanup is not included.

## Release gates

- Verify login/MFA/refresh/logout on a real Android and iOS device.
- Coach assigns a routine; the client sees the same days, sets, loads and rest instructions.
- Record sets offline, terminate/reopen the app, complete the workout and reconnect: no lost edits or duplicate sessions.
- Switch account/organization during delayed network responses: no cross-scope cache or UI leakage.
- Confirm the coach can read the client's synced exercise/set logs through the existing reporting flow.
- Configure `PROFIT_RELEASE_STORE_FILE`, `PROFIT_RELEASE_STORE_PASSWORD`, `PROFIT_RELEASE_KEY_ALIAS`, and `PROFIT_RELEASE_KEY_PASSWORD` outside source control. Previously embedded signing credentials must be treated as exposed and rotated as appropriate.
- Run both native builds against the team's supported Xcode/JDK/SDK versions, then schedule the React Native/dependency update separately from these functional changes.

## Native integration changes

`react-native.config.js` disables autolinking for the obsolete multiple-image picker and its Nitro dependency. The active client/profile flow does not use the old photo editor; restoring it requires explicitly re-enabling and validating that native capability. No npm dependencies were added or upgraded. The iOS lockfile now matches the already-installed RNReanimated version and excludes the unused photo-editor Pods. Dependency deployment targets are aligned to the app's existing iOS 16 minimum.

The obsolete checked-in Android JS bundle was removed. Debug builds require Metro (`npm start`); release builds must generate their JavaScript bundle through the normal React Native Gradle task, not reuse the old bundle.

## Rollback boundaries

- Mobile client flow: restore App/navigation/client screens, hooks, services, store, theme and tests as one unit. Preserve device-scoped workout records before rollback; the old app cannot display these drafts.
- Native credentials: revert the JS wrapper, both native bridges and their registration together; never reintroduce plaintext tokens or embedded release signing secrets.
- API: the assigned-routine endpoint is additive. Session models, migration, endpoint and tests form one unit; export/backup workout data before reversing a migration that contains real sessions. No live database migration or remote deployment was performed during implementation.

## Verification evidence

- Full TypeScript check and active-client ESLint: pass.
- Jest: **34 tests across 7 suites pass**, including dark sign-in surface and repeated-finish invariants.
- Android native Debug build: pass with JDK 17 and Gradle 8.9 for all configured ABIs.
- iOS native Debug simulator build: pass with Xcode 27.1 after Pod regeneration and deployment-target alignment.
- Production-mode Metro JavaScript bundles: generated successfully for Android and iOS from the actual app repository, without writing generated bundles back into source control.

Native builds were unsigned/development validation, not store-ready distributions. Device UI, live authentication and real API synchronization remain manual release gates. No migration was run against the user's development/production database and no remote deployment occurred.

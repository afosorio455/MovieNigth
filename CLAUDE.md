# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npx expo start

# Platform-specific
npx expo start --ios
npx expo start --android
npx expo start --web

# Lint
npx expo lint
```

There are no tests configured yet.

## Project Goal

**MovieNight** is an offline-first, collaborative movie voting app for groups watching together. Multiple users on the same Wi-Fi:
1. Log in with a name
2. Add movies they want to watch
3. Vote 👍 / 👎 on each movie
4. The app reveals the winner (most likes) with a confetti celebration
5. Everything syncs automatically to a NestJS + PostgreSQL backend every 30 seconds

## Architecture

### Routing Structure (Expo Router v6)

File-based routing with two main route groups:

- `app/(auth)/` — Unauthenticated flows (login screen)
- `app/(app)/` — Authenticated app with 4 bottom tabs:
  - `(home)/` — Movie Lobby (stack with `add-movie` modal)
  - `(voting)/` — Voting screen (stack with `winner` modal)
  - `history.tsx` — Past sessions history
  - `profile.tsx` — User profile

The root `app/_layout.tsx` sets `anchor: '(app)'` as the default group and imports `global.css` for Tailwind. Auth guard logic belongs in `app/_layout.tsx` — redirect to `/(auth)/login` if not signed in, replace to `/(app)/(home)` after login.

Navigation patterns:
```typescript
router.push('/(app)/(voting)');
router.replace('/(app)/(home)');  // Use replace after login
router.back();
```

### State Management

Two global React Contexts (both stubs in `src/context/`):

- **AuthContext** — exposes `{ userId, userName, userColor }`. Persisted with `expo-secure-store`.
- **SyncContext** — exposes `{ isSyncing, isOnline, pendingChanges }`. Wraps `syncService`.

Custom hooks in `src/hooks/hooks.ts`:
- `useAuth()` — access AuthContext
- `useSync()` — access SyncContext
- `useMovies(userId)` — returns `{ movies, getWinner, refetch }` from local SQLite
- `useUsers()` — returns `{ users, refetch }` from local SQLite

### Local Database (`src/services/database.ts`)

SQLite via `expo-sqlite`. Schema:

```sql
movies (id TEXT PK, title, year, created_by_user_id, created_at, synced INT DEFAULT 0)
users  (id TEXT PK, name, avatar_color, created_at)
votes  (id TEXT PK, movie_id, user_id, vote_type TEXT -- 'like'|'dislike', created_at, synced INT DEFAULT 0)
sync_metadata (id TEXT PK, last_sync_timestamp INT)
```

`synced = 0` marks records pending upload. After a successful push, mark them `synced = 1`.

### Sync Service (`src/services/syncService.ts`)

Pull/push cycle runs every 30 seconds in the background:

```
PULL  GET /api/sync?lastSync=<timestamp>  → insert new movies/votes (synced=1)
PUSH  POST /api/sync { movies, votes }    → send records where synced=0 → mark synced=1
```

Conflict resolution: **last-write-wins** based on `created_at`.

API:
```typescript
syncService.startAutoSync();   // call from SyncContext on mount
syncService.forceSyncNow();    // manual trigger
syncService.onStatusChange(cb); // subscribe to { isSyncing, isOnline, pendingChanges }
```

### Backend (NestJS + PostgreSQL)

Two endpoints:
- `GET /api/sync?lastSync=1234567890` → `{ movies, votes, timestamp }`
- `POST /api/sync` body `{ movies, votes }` → `{ success: true }`

Same schema as SQLite, with automatic timestamps and indexes on the server side.

### Styling

NativeWind v4 (Tailwind CSS for React Native). Use `className` props for all new code. `global.css` is imported in the root layout. The `@/` path alias maps to the project root.

Dark mode: use `dark:` Tailwind variants — `useColorScheme()` drives the `ThemeProvider` in the root layout.

### UI Components

**App-specific** (`src/components/` — all stubs to implement):
- `MovieCard` — shows title, year, like/dislike counts and vote buttons
- `VoteButton` — 👍 / 👎 with visual feedback
- `UserAvatar` — colored circle with initials
- `SyncIndicator` — online/offline/syncing badge (show in Home header)
- `ConfettiAnimation` — Lottie animation for the winner screen
- `Loading` / `EmptyState` — shared utility components

**Template UI** (`components/` — keep as-is):
- `components/ui/icon-symbol.tsx` — SF Symbols → Material Icons mapping (add entries here for new icons)
- `components/haptic-tab.tsx` — haptic feedback on iOS tab press
- `components/themed-text.tsx` / `themed-view.tsx` — theme-aware primitives
- `constants/theme.ts` — `Colors` (`light`/`dark`) and `Fonts` definitions

### New Architecture flags

`newArchEnabled: true` and `reactCompiler: true` are set in `app.json`. Avoid mutating refs during render or other React Compiler-incompatible patterns.

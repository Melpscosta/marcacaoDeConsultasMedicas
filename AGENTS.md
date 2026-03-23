# AGENTS.md

## Cursor Cloud specific instructions

### Overview

HealthConnect is a **React Native / Expo** medical appointment scheduling app (frontend-only, no backend). All data is mocked locally via AsyncStorage. There are no external services, databases, or APIs to configure.

### Running the app

- **Web (recommended for cloud agents):** `npm run web` (alias for `npx expo start --web`). Serves on `http://localhost:19006` by default.
- The Metro bundler uses Babel for transpilation; `tsc --noEmit` reports many pre-existing type errors (mostly styled-components prop typing). These do **not** block bundling or running the app.

### Demo accounts

All accounts use password `123456`. See `README.md` § "Contas de Demonstração" for the full list. Quick picks:
- Patient: `teste@paciente.com`
- Doctor: `joao@example.com`
- Admin: `admin@example.com`

### Testing

- No automated test framework is configured (no Jest, no Vitest, no test files).
- Lint/type-check: `npx tsc --noEmit` (expect pre-existing errors).
- Manual testing via the Expo web UI is the primary verification method.

### Gotchas

- Expo may warn about package version mismatches on `npm install`; these are cosmetic and do not prevent the app from running.
- The `--web` flag requires `react-native-web` and `react-dom` (both are already in `dependencies`).

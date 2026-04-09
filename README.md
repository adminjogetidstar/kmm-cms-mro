# Shared Module

This folder contains all shared API services, TanStack Query hooks, Redux store, types, and constants that can be used across multiple projects (CMS and WebApp).

## Structure

```
shared/
├── api/                 # API service functions
│   ├── helper.ts       # Base API request helper
│   ├── index.ts        # Main API exports
│   ├── locations.ts    # Location API
│   ├── menus.ts        # Menu API
│   ├── roles.ts        # Role API
│   └── ticketDetail.ts # Ticket API
├── tanstack/           # TanStack Query hooks
│   ├── index.ts        # Main export
│   ├── assignees.ts    # Assignee hooks
│   ├── locations.ts    # Location hooks
│   ├── menus.ts        # Menu hooks
│   ├── reasonPendings.ts
│   ├── reasonRejects.ts
│   ├── roles.ts        # Role hooks
│   ├── stores.ts       # Store hooks
│   ├── tickets.ts      # Ticket hooks
│   └── users.ts        # User hooks
├── redux/              # Redux store & state management
│   ├── slices/
│   │   └── authSlice.ts # Auth state slice
│   ├── hooks.ts        # Custom Redux hooks (useSlice, etc)
│   ├── store.ts        # Store configuration
│   ├── provider.tsx    # Redux Provider component
│   └── index.ts        # Redux exports
├── constants/          # Shared constants
│   ├── queryKeys.ts    # TanStack Query keys
│   └── queryKey.ts     # Alternative query keys
├── types/              # TypeScript types
│   └── backend.ts      # Backend API types
├── utils/              # Utility functions
│   └── navigator.ts    # Navigation helper
└── index.ts            # Barrel export

```

## Usage

### In CMS Project

```typescript
// Import API services
import { authApi, roleApi, menuApi } from '@shared/api';

// Import TanStack hooks
import { useGetActiveRoles, useCreateRole } from '@shared/tanstack';

// Import Redux
import { StoreProvider, useSlice, authSlice } from '@shared/redux';

// Import types
import type { LoginRequest, RoleResponse } from '@shared/types/backend';

// Import constants
import { QUERY_KEYS } from '@shared/constants/queryKeys';
```

### In WebApp Project

The same imports will work in the webapp project once you:

1. Copy or symlink this `shared` folder
2. Add `@shared/*` alias to tsconfig.json and vite.config.ts

## Redux Usage

### Setup (Already implemented in both projects)

#### Basic Setup (Shared slices only)

Wrap your app with `StoreProvider`:

```tsx
import { StoreProvider } from '@shared/redux';

function App() {
  return (
    <StoreProvider>
      {/* Your app routes */}
    </StoreProvider>
  );
}
```

#### With Project-Specific Reducers

Each project can add their own slices by passing `reducers` prop:

```tsx
import { StoreProvider } from '@shared/redux';
import mySlice from './lib/redux/slices/mySlice';
import anotherSlice from './lib/redux/slices/anotherSlice';

function App() {
  return (
    <StoreProvider
      reducers={{
        mySlice: mySlice.reducer,
        anotherSlice: anotherSlice.reducer,
      }}
    >
      {/* Your app routes */}
    </StoreProvider>
  );
}
```

**Example in CMS:**
```tsx
// CMS has a hello slice that WebApp doesn't have
import helloSlice from './lib/redux/slices/helloSlice';

<StoreProvider
  reducers={{
    hello: helloSlice.reducer,
  }}
>
  {/* CMS routes */}
</StoreProvider>
```

### Using Auth State with `useSlice`

```tsx
import { useSlice, authSlice } from '@shared/redux';

function MyComponent() {
  const [authState, authDispatch] = useSlice(authSlice);

  // Access state
  const user = authState.user;
  const isAuthenticated = authState.isAuthenticated;

  // Dispatch actions
  const handleLogin = (user, accessToken, refreshToken) => {
    authDispatch('setCredentials', { user, accessToken, refreshToken });
  };

  const handleLogout = () => {
    authDispatch('logout');
  };

  const handleUpdateUser = (updates) => {
    authDispatch('updateUser', updates);
  };
}
```

### Available Auth Actions

- `setCredentials({ user, accessToken, refreshToken })` - Save login data
- `logout()` - Clear all auth data (Redux + localStorage)
- `updateUser(partialUserData)` - Update user info

### Auth State Structure

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
```

## Dependencies

- `react-hot-toast` - For toast notifications
- `@tanstack/react-query` - For data fetching and caching
- `@reduxjs/toolkit` - For state management
- `react-redux` - React bindings for Redux

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for API calls (defaults to `/api/v1`)

## Notes

- All API calls use the centralized `apiRequest` helper in `api/helper.ts`
- Authentication tokens are automatically injected from localStorage
- 401 responses trigger automatic logout and redirect to login
- Redux auth state auto-loads from localStorage on app start
- Redux auth state auto-saves to localStorage on login
- Redux auth state auto-clears localStorage on logout

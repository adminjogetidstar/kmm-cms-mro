# API Services

Global API services untuk KMM MRO Backend.

## Setup

1. Copy `.env.example` ke `.env` di root project
2. Set `VITE_API_BASE_URL` sesuai dengan backend URL Anda

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Usage

### Import API Service

```typescript
import { roleApi } from '@/services/api';
```

### Available Services

#### Role API

```typescript
// Get all roles
const response = await roleApi.getAllRoles();
console.log(response.data); // Array of roles

// Get active roles only
const activeRoles = await roleApi.getActiveRoles();

// Get role by UUID
const role = await roleApi.getRoleByUUID('uuid-here');

// Create new role
const newRole = await roleApi.createRole({
  role_name: 'New Role',
  role_code: 'NR',
  last_action_by: 'admin@example.com'
});

// Update role
const updatedRole = await roleApi.updateRole('uuid-here', {
  role_name: 'Updated Role Name',
  last_action_by: 'admin@example.com',
  is_active: true
});

// Deactivate role
await roleApi.deactivateRole('uuid-here');
```

## Example Implementation

Lihat `src/pages/masterdata/Role.tsx` untuk contoh implementasi lengkap dengan:
- Fetching data dari API
- Loading states
- Error handling
- Delete/Deactivate functionality

## Adding New API Services

Untuk menambahkan API service baru, ikuti pattern yang sama di `src/services/api.ts`:

1. Import types dari `dokumentasi.ts`
2. Buat object API dengan methods yang sesuai
3. Gunakan helper function `apiRequest` untuk consistency
4. Export API service di akhir file

Contoh:

```typescript
export const menuApi = {
  getAllMenus: async (): Promise<MenuListResponse> => {
    return apiRequest<MenuListResponse>('/menus');
  },
  // ... other methods
};

// Export
export default {
  role: roleApi,
  menu: menuApi, // Add new service here
};
```

## Error Handling

Semua API calls akan throw error jika request gagal. Gunakan try-catch untuk handling:

```typescript
try {
  const response = await roleApi.getAllRoles();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

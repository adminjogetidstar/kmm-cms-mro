import type {
	RoleListResponse,
	RoleDetailResponse,
	CreateRoleRequest,
	RoleResponse,
	UpdateRoleRequest,
} from '../types/backend';
import apiRequest from './helper';

export const roleApi = {
	/**
	 * Get All Roles (Active)
	 * GET /api/v1/roles/active?page=1&page_size=10&role_code=admin&role_name=admin&sort=role_name&order=DESC
	 */
	getAllRoles: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<RoleListResponse> => {
		let url = `/roles/active?page=${page}&page_size=${pageSize}`;
		if (sortBy && sortOrder) {
			url += `&sort=${sortBy}&order=${sortOrder}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&role_code=${searchTerm}&role_name=${searchTerm}`;
		}
		return apiRequest<RoleListResponse>(url);
	},

	/**
	 * Get Active Roles
	 * GET /api/v1/roles/active
	 */
	getActiveRoles: async (): Promise<RoleListResponse> => {
		return apiRequest<RoleListResponse>('/roles/active');
	},

	/**
	 * Get Role by UUID
	 * GET /api/v1/roles/:uuid
	 */
	getRoleByUUID: async (uuid: string): Promise<RoleDetailResponse> => {
		return apiRequest<RoleDetailResponse>(`/roles/${uuid}`);
	},

	/**
	 * Create Role
	 * POST /api/v1/roles
	 */
	createRole: async (data: CreateRoleRequest): Promise<RoleResponse> => {
		return apiRequest<RoleResponse>('/roles', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Role
	 * PUT /api/v1/roles/:uuid
	 */
	updateRole: async (
		uuid: string,
		data: UpdateRoleRequest
	): Promise<RoleResponse> => {
		return apiRequest<RoleResponse>(`/roles/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Role
	 * DELETE /api/v1/roles/:uuid
	 */
	deleteRole: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ message: string }> => {
		return apiRequest<{ message: string }>(`/roles/${uuid}`, {
			method: 'DELETE',
			body: JSON.stringify({
				last_action_by: lastActionBy,
			}),
		});
	},
};

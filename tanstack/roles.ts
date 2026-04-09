/**
 * Tanstack Query hooks for Role API
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '../api/roles';
import type {
	CreateRoleRequest,
	RoleDetailResponse,
	RoleListResponse,
	RoleResponse,
} from '../types/backend';
import { QUERY_KEYS } from '../constants/queryKey';

/**
 * Hook to get all active roles
 * GET /api/v1/roles/active
 */
export const useGetActiveRoles = () => {
	return useQuery<RoleListResponse>({
		queryKey: [QUERY_KEYS.ROLES],
		queryFn: () => roleApi.getActiveRoles(),
		staleTime: 300000, // 5 minutes
	});
};

/**
 * Hook to get role by UUID
 * GET /api/v1/roles/:uuid
 */
export const useGetRoleByUUID = (uuid: string | undefined) => {
	return useQuery<RoleDetailResponse>({
		queryKey: [...QUERY_KEYS.ROLES_DETAIL, uuid],
		queryFn: () => roleApi.getRoleByUUID(uuid!),
		enabled: !!uuid,
	});
};

/**
 * Hook to create a new role
 * POST /api/v1/roles
 */
export const useCreateRole = () => {
	const queryClient = useQueryClient();

	return useMutation<RoleResponse, Error, CreateRoleRequest>({
		mutationFn: (data: CreateRoleRequest) => roleApi.createRole(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
		},
	});
};

/**
 * Hook to update an existing role
 * PUT /api/v1/roles/:uuid
 */
export const useUpdateRole = () => {
	const queryClient = useQueryClient();

	return useMutation<
		RoleResponse,
		Error,
		{ uuid: string; data: CreateRoleRequest }
	>({
		mutationFn: ({ uuid, data }) => roleApi.updateRole(uuid, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
		},
	});
};

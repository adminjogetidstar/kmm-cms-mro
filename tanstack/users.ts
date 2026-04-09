/**
 * Tanstack Query hooks for User API
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserDetailResponse,
	UserListResponse,
} from '../types/backend';
import toast from 'react-hot-toast';

import { useLocation, useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@shared/constants/queryKey';

/**
 * Hook to get all active users
 * GET /api/v1/users/active
 */
export const useGetUsers = (
	page: number = 1,
	pageSize: number = 10,
	search?: string,
	sortBy?: string,
	sortOrder?: 'ASC' | 'DESC',
	store_uuid?: string[]
) => {
	return useQuery<UserListResponse>({
		queryKey: [
			...QUERY_KEYS.USERS_LIST,
			page,
			pageSize,
			search,
			sortBy,
			sortOrder,
			store_uuid,
		],
		queryFn: () =>
			userApi.getAllUsers(
				page,
				pageSize,
				search,
				sortBy,
				sortOrder,
				store_uuid
			),
		staleTime: 300000, // 5 minutes
	});
};

/**
 * Hook to get user by UUID
 * GET /api/v1/users/:uuid
 */
export const useGetUserByUUID = (uuid: string | undefined) => {
	return useQuery<UserDetailResponse>({
		queryKey: [...QUERY_KEYS.USERS_DETAIL, uuid],
		queryFn: () => userApi.getUserByUUID(uuid!),
		enabled: !!uuid,
	});
};

export const useForgotPassword = (reset?: () => void) => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: { email: string }) => userApi.forgotPassword(data),
		onSuccess: (response) => {
			reset?.();
			setTimeout(() => navigate('/login', { replace: true }), 1000);
			toast.success(
				response.message || 'Reset password email sent successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(
				error.message ||
					'Failed to send reset password email. Please try again.'
			);
		},
	});
};

/**
 * Hook to create a new user
 * POST /api/v1/users
 */
export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
		onSuccess: () => {
			// Invalidate users queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
		},
	});
};

/**
 * Hook to update an existing user
 * PUT /api/v1/users/:uuid
 */
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, { uuid: string; data: UpdateUserRequest }>({
		mutationFn: ({ uuid, data }) => userApi.updateUser(uuid, data),
		onSuccess: () => {
			// Invalidate users queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
		},
	});
};

/**
 * Hook to delete a user
 * DELETE /api/v1/users/:uuid
 */
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { uuid: string; lastActionBy: string }>({
		mutationFn: ({ uuid, lastActionBy }) =>
			userApi.deleteUser(uuid, lastActionBy),
		onSuccess: () => {
			// Invalidate users queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
		},
	});
};

/**
 * Hook to set user password
 * POST /api/v1/users/password/set
 */
export const useSetPassword = () => {
	const { pathname } = useLocation();

	return useMutation<
		{ Success: boolean; message: string },
		Error,
		{ token: string; password: string; confirm_password: string }
	>({
		mutationKey: ['mutate', pathname],
		mutationFn: (data) => {
			const { confirm_password, password, token } = data;
			return pathname.includes('/reset-password')
				? userApi.resetPassword({
						token,
						confirm_password,
						new_password: password,
					})
				: userApi.setPassword(data);
		},
	});
};

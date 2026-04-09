/**
 * Tanstack Query hooks for Profile API
 */

import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../api';
import type {
	UpdateNameFormData,
	ChangePasswordFormData,
} from '../schemas/profile';
import toast from 'react-hot-toast';

/**
 * Hook to update user name
 * PUT /api/v1/users/me/name
 */
export const useUpdateName = () => {
	return useMutation({
		mutationFn: (data: UpdateNameFormData) => profileApi.updateName(data),
		onSuccess: (response) => {
			toast.success(response.message || 'Name updated successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to update name');
		},
	});
};

/**
 * Hook to change password
 * POST /api/v1/users/:uuid/password/change
 */
export const useChangePassword = () => {
	return useMutation<
		{ Success: boolean; message: string },
		Error,
		{ userUuid: string; data: ChangePasswordFormData }
	>({
		mutationFn: ({ userUuid, data }) =>
			profileApi.changePassword(userUuid, data),
		onSuccess: (response) => {
			toast.success(response.message || 'Password changed successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to change password');
		},
	});
};

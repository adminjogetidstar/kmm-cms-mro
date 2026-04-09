import apiRequest from './helper';
import type {
	UpdateNameFormData,
	ChangePasswordFormData,
} from '../schemas/profile';
import { UserResponse } from '@shared/types/backend';

export const profileApi = {
	/**
	 * Update User Name
	 * PUT /api/v1/users/me/name
	 */
	updateName: async (data: UpdateNameFormData) => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: UserResponse;
		}>('/users/me/name', {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Change Password
	 * POST /api/v1/users/:uuid/password/change
	 */
	changePassword: async (
		userUuid: string,
		data: ChangePasswordFormData
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/users/${userUuid}/password/change`,
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	},
};

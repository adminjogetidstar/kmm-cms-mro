import { z } from 'zod';

export const updateNameSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required'),
});

export const changePasswordSchema = z
	.object({
		old_password: z.string().min(1, 'Old password is required'),
		new_password: z
			.string()
			.min(8, 'New password must be at least 8 characters'),
		confirm_new_password: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: 'Passwords do not match',
		path: ['confirm_new_password'],
	});

export type UpdateNameFormData = z.infer<typeof updateNameSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

import { ROLE_CODES } from '@shared/constants';
import { authSlice, useSlice } from '@shared/redux';

export function useAuthData() {
	const [data] = useSlice(authSlice);

	const isUser = data.user?.role_code === ROLE_CODES.USER;
	const isAdmin = data.user?.role_code === ROLE_CODES.ADMIN;
	const isMaintenance = data.user?.role_code === ROLE_CODES.MAINTENER;
	const isSuperAdmin = data.user?.role_code === ROLE_CODES.SUPER;

	return { ...data.user, isUser, isAdmin, isMaintenance, isSuperAdmin };
}

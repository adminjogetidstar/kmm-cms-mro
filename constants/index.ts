export type Roles = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];
export const ROLE_CODES = {
	SUPER: 'SUPER',
	ADMIN: 'ADMIN',
	MAINTENER: 'MAINTENER',
	USER: 'USER',
} as const;

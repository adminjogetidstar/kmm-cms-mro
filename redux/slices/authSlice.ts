import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Roles } from '@shared/constants';
import { UserResponse } from '@shared/types/backend';

interface User {
	uuid: string;
	employee_id: string;
	email: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	profile_picture_url: string;
	role_uuid: string;
	role_name: string;
	role_code: Roles;
	store_uuid: string;
	store_name: string;
	store_code: string;
}

export interface AuthState {
	user: UserResponse | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): AuthState => {
	try {
		const accessToken = localStorage.getItem('access_token');
		const refreshToken = localStorage.getItem('refresh_token');
		const userStr = localStorage.getItem('user');

		if (accessToken && refreshToken && userStr) {
			return {
				user: JSON.parse(userStr) as UserResponse,
				accessToken,
				refreshToken,
				isAuthenticated: true,
			};
		}
	} catch (error) {
		console.error('Failed to load auth from storage:', error);
	}

	return {
		user: null,
		accessToken: null,
		refreshToken: null,
		isAuthenticated: false,
	};
};

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{
				user: UserResponse;
				accessToken: string;
				refreshToken: string;
			}>
		) => {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = true;

			localStorage.setItem('access_token', action.payload.accessToken);
			localStorage.setItem('refresh_token', action.payload.refreshToken);
			localStorage.setItem('user', JSON.stringify(action.payload.user));
		},
		logout: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;

			// Clear localStorage
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('user');
		},
		updateUser: (state, action: PayloadAction<Partial<User>>) => {
			if (state.user) {
				state.user = { ...state.user, ...action.payload };
			}
		},
	},
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice;

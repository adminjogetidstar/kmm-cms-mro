import toast from 'react-hot-toast';
import { getNavigator } from '../utils/navigator';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USER_AGENT = import.meta.env.VITE_USER_AGENT;

// Helper function for API calls
export default async function apiRequest<T>(
	endpoint: string,
	_options?: RequestInit & { content?: 'json' | 'form' | 'download' }
): Promise<T> {
	const { content = 'json', ...options } = _options || {};

	const url = `${BASE_URL}${endpoint}`;

	const defaultHeaders: HeadersInit = {
		...(content === 'json' ? { 'Content-Type': 'application/json' } : {}),
		'User-Application': USER_AGENT,
		'User-Language': localStorage.getItem('language')!,
	};

	// Auto-inject Authorization header for protected endpoints
	const token = localStorage.getItem('access_token');
	const isLoginEndpoint = endpoint === '/auth/login';

	if (token && !isLoginEndpoint) {
		defaultHeaders['Authorization'] = `Bearer ${token}`;
	}

	const config: RequestInit = {
		...options,
		headers: {
			...defaultHeaders,
			...options?.headers,
		},
		// Prevent caching for non-GET requests
		cache:
			options?.method && options.method !== 'GET' ? 'no-store' : options?.cache,
	};

	try {
		const response = await fetch(url, config);

		if (response.ok) {
			if (content === 'download') return response.blob() as T;
			return response.json() as T;
		}

		// Handle 401 Unauthorized - redirect to login
		const excludedPaths = [
			'/login',
			'/forgot-password',
			'/create-password',
			'/reset-password',
			'/register',
		];

		const isUnauthPage = excludedPaths.includes(window.location.pathname);

		if (!(response.status === 401 && !isUnauthPage)) {
			const errorData = await response.json().catch(() => ({}));

			throw new Error(
				(errorData as any)?.message || `HTTP error! status: ${response.status}`
			);
		}

		const nav = getNavigator();

		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('user');

		toast.error('Session expired. Please log in again.', {
			duration: 2500,
			id: 'Unauthorized',
			ariaProps: { role: 'status', 'aria-live': 'assertive' },
		});

		nav?.('/login', { replace: true, viewTransition: true });

		throw new Error('Unauthorized - Redirecting to login');
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}
}

import type {
	NotificationListParams,
	NotificationListResponse,
	UnreadCountResponse,
} from '../types/backend';
import apiRequest from './helper';

interface RegisterPushTokenPayload {
	subscription: PushSubscription;
}

interface RegisterPushTokenResponse {
	success: boolean;
	message: string;
}

export function registerPushToken(payload: RegisterPushTokenPayload) {
	return apiRequest<RegisterPushTokenResponse>('/devices/register', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export function unregisterPushToken(endpoint: string) {
	return apiRequest<RegisterPushTokenResponse>('/devices/unregister', {
		method: 'POST',
		body: JSON.stringify({ endpoint }),
	});
}

// ============================================================================
// NOTIFICATION API SERVICE
// ============================================================================

export const notificationApi = {
	/**
	 * Get Notifications List
	 * GET /api/v1/notifications?page=1&page_size=10&is_read=boolean&type=ticket_assigned|transfer_rejected
	 */
	getNotifications: async (
		params?: NotificationListParams
	): Promise<NotificationListResponse> => {
		// const searchParams = new URLSearchParams();

		// if (params?.page) searchParams.set('page', String(params.page));
		// if (params?.page_size)
		// 	searchParams.set('page_size', String(params.page_size));
		// if (params?.is_read !== undefined)
		// 	searchParams.set('is_read', String(params.is_read));
		// if (params?.type) searchParams.set('type', params.type);

		// const query = searchParams.toString();

		const query = toQueryParams(params as MyObject);
		const url = `/notifications${query ? `?${query}` : ''}`;

		return apiRequest<NotificationListResponse>(url);
	},

	/**
	 * Get Unread Count
	 * GET /api/v1/notifications/unread-count
	 */
	getUnreadCount: async (): Promise<UnreadCountResponse> => {
		return apiRequest<UnreadCountResponse>('/notifications/unread-count');
	},

	/**
	 * Mark Notification as Read
	 * PUT /api/v1/notifications/:notification_uuid/read
	 */
	markAsRead: async (
		notificationUuid: string
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`/notifications/${notificationUuid}/read`,
			{ method: 'PUT' }
		);
	},
};

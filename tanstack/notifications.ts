import { useMutation, useQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification';
import { QUERY_KEYS } from '../constants/queryKey';
// import { queryClient } from './index';
import type {
	NotificationListParams,
	NotificationListResponse,
	UnreadCountResponse,
} from '../types/backend';

export const useNotifications = (params?: NotificationListParams) => {
	return useQuery<NotificationListResponse>({
		queryKey: [
			QUERY_KEYS.NOTIFICATIONS_LIST,
			params?.page,
			params?.page_size,
			params?.is_read,
			params?.type,
			params?.is_active
		],
		queryFn: () => notificationApi.getNotifications(params),
		staleTime: 1000 * 60, // 1 minute
	});
};

export const useUnreadNotificationCount = () => {
	return useQuery<UnreadCountResponse>({
		queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT,
		queryFn: () => notificationApi.getUnreadCount(),
		staleTime: 1000 * 30, // 30 seconds
		refetchInterval: 1000 * 60, // refetch every 1 minute
	});
};

export const useMarkNotificationAsRead = () => {
	return useMutation({
		mutationFn: (notificationUuid: string) =>
			notificationApi.markAsRead(notificationUuid),
		onSuccess: () => {
			// queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
		},
	});
};

/**
 * TanStack Query Hooks for Ticket Priorities
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketPriorityApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';
import type {
	TicketPriorityResponse,
	CreateTicketPriorityRequest,
	UpdateTicketPriorityRequest,
} from '../types/backend';

// Re-export type
export type { TicketPriority } from '../types/backend';

import type { TicketPriority } from '../types/backend';

// Transform API response to frontend format
const transformTicketPriority = (
	priority: TicketPriorityResponse
): TicketPriority => ({
	id: priority.uuid,
	uuid: priority.uuid,
	priority_code: priority.priority_code,
	priority_name: priority.priority_name,
	priority_level: priority.priority_level,
	description: priority.description || '',
	sla_response_time: priority.sla_response_time || 0,
	sla_resolution_time: priority.sla_resolution_time || 0,
});

/**
 * Hook to fetch all ticket priorities
 */
export const useTicketPriorities = (
	page: number = 1,
	pageSize: number = 1000,
	search?: string,
	sortBy?: 'priority_name',
	sortOrder?: 'ASC' | 'DESC'
) => {
	return useQuery({
		queryKey: [
			...QUERY_KEYS.TICKET_PRIORITIES,
			{ page, pageSize, search, sortBy, sortOrder },
		],
		queryFn: async () => {
			const response = await ticketPriorityApi.getAllTicketPriorities(
				page,
				pageSize,
				search,
				sortBy,
				sortOrder
			);

			if (!response.data?.data || !Array.isArray(response.data.data)) {
				throw new Error('Invalid data format received from server');
			}

			return {
				data: response.data.data.map(transformTicketPriority),
				pagination: {
					current_page: response.data.current_page,
					page_size: response.data.page_size,
					total_pages: response.data.total_pages,
					total_records: response.data.total_records,
					has_next: response.data.has_next,
					has_prev: response.data.has_prev,
				},
			};
		},
	});
};

/**
 * Hook to fetch single ticket priority by UUID
 */
export const useTicketPriority = (uuid: string) => {
	return useQuery({
		queryKey: [...QUERY_KEYS.TICKET_PRIORITIES, uuid],
		queryFn: async () => {
			const response = await ticketPriorityApi.getTicketPriorityByUUID(uuid);
			return transformTicketPriority(response.data);
		},
		enabled: !!uuid,
	});
};

/**
 * Hook to create ticket priority
 */
export const useCreateTicketPriority = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateTicketPriorityRequest) =>
			ticketPriorityApi.createTicketPriority(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_PRIORITIES });
		},
	});
};

/**
 * Hook to update ticket priority
 */
export const useUpdateTicketPriority = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			uuid,
			data,
		}: {
			uuid: string;
			data: UpdateTicketPriorityRequest;
		}) => ticketPriorityApi.updateTicketPriority(uuid, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_PRIORITIES });
		},
	});
};

/**
 * Hook to delete ticket priority
 */
export const useDeleteTicketPriority = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			uuid,
			lastActionBy,
		}: {
			uuid: string;
			lastActionBy?: string;
		}) => ticketPriorityApi.deleteTicketPriority(uuid, lastActionBy),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_PRIORITIES });
		},
	});
};

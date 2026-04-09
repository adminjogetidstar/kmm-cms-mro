import { useQuery, useMutation } from '@tanstack/react-query';
import {
	type GetAllTicketsParams,
	type TicketExportParams,
	ticketApi,
} from '../api';
import { QUERY_KEYS } from '../constants/queryKey';
import { queryClient } from './index';
import type {
	TicketDetailResponse,
	TicketActivityListResponse,
	TicketHistoryListResponse,
} from '../types/backend';

export const useTickets = (params: GetAllTicketsParams) => {
	return useQuery({
		queryKey: [
			QUERY_KEYS.TICKETS,
			params.is_admin ? 'Admin' : 'User',
			params.page,
			params.page_size,
			params.search,
			params.sort,
			params.order,
			params.priority_uuid,
			params.start_date,
			params.end_date,
			params.date_filter_type,
			params.ticket_status,
			params.store_uuid,
			params.floor_area_uuid,
			params.maintenance_type_uuid,
		],
		queryFn: () => ticketApi.getAllTickets(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useTicketStatusCount = (search?: string, isAdmin?: boolean) => {
	return useQuery({
		queryKey: [QUERY_KEYS.TICKET_STATUS_COUNT, search],
		queryFn: () => ticketApi.getStatusCount(search, isAdmin),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useTicketDetail = (id: string, isAdmin?: boolean) => {
	return useQuery<TicketDetailResponse>({
		queryKey: [...QUERY_KEYS.TICKET_DETAIL, id],
		queryFn: () => ticketApi.getTicketDetail(id, isAdmin),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useTicketActivities = (
	ticketId: string,
	page: number,
	pageSize: number,
	isAdmin?: boolean
) => {
	return useQuery<TicketActivityListResponse>({
		queryKey: [...QUERY_KEYS.TICKET_ACTIVITIES, ticketId, page, pageSize],
		queryFn: () =>
			ticketApi.getTicketActivities(ticketId, page, pageSize, isAdmin),
		enabled: !!ticketId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useTicketHistories = (
	ticketId: string,
	page: number,
	pageSize: number,
	isAdmin?: boolean
) => {
	return useQuery<TicketHistoryListResponse>({
		queryKey: [...QUERY_KEYS.TICKET_HISTORIES, ticketId, page, pageSize],
		queryFn: () =>
			ticketApi.getTicketHistories(ticketId, page, pageSize, isAdmin),
		enabled: !!ticketId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useRejectTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			data,
		}: {
			ticketNumber: string;
			data: { remarks: string; reasonId: string };
		}) => ticketApi.rejectTicket(ticketNumber, data, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.TICKET_STATUS_COUNT,
			});
		},
	});
};

export const usePendingTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			data,
		}: {
			ticketNumber: string;
			data: { remarks: string; reasonId: string };
		}) => ticketApi.pendingTicket(ticketNumber, data, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.TICKET_STATUS_COUNT,
			});
		},
	});
};

export const useEscalateTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: (ticketNumber: string) =>
			ticketApi.escalateTicket(ticketNumber, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.TICKET_STATUS_COUNT,
			});
		},
	});
};

export const useAcknowledgeTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: (ticketNumber: string) =>
			ticketApi.acknowledgeTicket(ticketNumber, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
		},
	});
};

export const useResumeTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: (ticketNumber: string) =>
			ticketApi.resumeTicket(ticketNumber, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_ACTIVITIES });
		},
	});
};

export const useResolveTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			formData,
		}: {
			ticketNumber: string;
			formData: FormData;
		}) => ticketApi.resolveTicket(ticketNumber, formData, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
		},
	});
};

export const useTransferTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			data,
		}: {
			ticketNumber: string;
			data: { reason_transfer_id: string; remarks: string };
		}) => ticketApi.transferTicket(ticketNumber, data, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
		},
	});
};

export const useCompleteActivity = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			activityId,
		}: {
			ticketNumber: string;
			activityId: string;
		}) => ticketApi.completeActivity(ticketNumber, activityId, isAdmin),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.TICKET_ACTIVITIES, variables.ticketNumber],
			});
		},
	});
};

export const useCreateActivity = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			data,
		}: {
			ticketNumber: string;
			data: { category: 'Preparation' | 'Fixing'; remarks: string };
		}) => ticketApi.createActivity(ticketNumber, data, isAdmin),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.TICKET_ACTIVITIES, variables.ticketNumber],
			});
		},
	});
};

export const useUpdateActivity = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			activityId,
			data,
		}: {
			ticketNumber: string;
			activityId: string;
			data: { category: 'Preparation' | 'Fixing'; remarks: string };
		}) => ticketApi.updateActivity(ticketNumber, activityId, data, isAdmin),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.TICKET_ACTIVITIES, variables.ticketNumber],
			});
		},
	});
};

export const useRejectTransferTicket = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			data,
		}: {
			ticketNumber: string;
			data: { remarks: string; reasonId: string };
		}) => ticketApi.rejectTransferTicket(ticketNumber, data, isAdmin),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKETS });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_DETAIL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.TICKET_STATUS_COUNT,
			});
		},
	});
};

export const useDeleteActivity = (isAdmin?: boolean) => {
	return useMutation({
		mutationFn: ({
			ticketNumber,
			activityId,
		}: {
			ticketNumber: string;
			activityId: string;
		}) => ticketApi.deleteActivity(ticketNumber, activityId, isAdmin),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.TICKET_ACTIVITIES, variables.ticketNumber],
			});
		},
	});
};

export const useCreateTicket = () => {
	return useMutation({
		mutationFn: (formData: FormData) => ticketApi.createTicket(formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TICKETS] });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.TICKET_STATUS_COUNT,
			});
		},
	});
};

export const useExportTickets = () => {
	return useMutation({
		mutationFn: (params: TicketExportParams) => {
			const newParams = { ...params, page: 1, page_size: 10 ** 10 };

			return ticketApi.exportTickets(newParams);
		},
		onSuccess: (blob) => {
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.xlsx`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		},
	});
};

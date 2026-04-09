import type {
	TicketListResponse,
	TicketDetailResponse,
	TicketActivityListResponse,
	TicketHistoryListResponse,
	CreateActivityRequest,
	CreateActivityResponse,
	UpdateActivityRequest,
	UpdateActivityResponse,
	AssignTicketFormData,
	DateFilterType,
} from '../types/backend';
import apiRequest from './helper';

export type TicketExportParams = {
	priority_uuid?: string;
	store_uuid?: string;
	start_date?: string;
	end_date?: string;
};

export type GetAllTicketsParams = {
	page: number;
	page_size: number;
	search?: string;
	sort?: string;
	order?: 'asc' | 'desc';
	priority_uuid?: string;
	maintenance_type_uuid?: string;
	ticket_status?: string;
	start_date?: string;
	end_date?: string;
	date_filter_type?: DateFilterType;
	is_admin?: boolean;
	store_uuid?: string;
	floor_area_uuid?: string;
};

export const ticketApi = {
	/**
	 * Create Ticket
	 * POST /api/v1/tickets
	 */
	createTicket: async (
		formData: FormData
	): Promise<{
		success: boolean;
		message: string;
		data: { ticket_number: string };
	}> => {
		return apiRequest('/tickets', {
			method: 'POST',
			body: formData,
			content: 'form',
		});
	},

	/**
	 * Get All Tickets
	 * GET /api/v1/tickets?page=1&page_size=10
	 */
	getAllTickets: async (
		params: GetAllTicketsParams
	): Promise<TicketListResponse> => {
		const {
			page,
			page_size,
			search,
			sort,
			order,
			priority_uuid,
			start_date,
			end_date,
			date_filter_type,
			is_admin = true,
			ticket_status: status_uuid,
			store_uuid,
			floor_area_uuid,
			maintenance_type_uuid,
		} = params;

		let url = `${
			is_admin ? '/admin' : ''
		}/tickets?page=${page}&page_size=${page_size}`;

		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&search=${searchTerm}`;
		}
		if (priority_uuid) {
			url += `&priority_uuid=${priority_uuid}`;
		}
		if (status_uuid && status_uuid !== 'all') {
			url += `&ticket_status=${
				status_uuid === 'request_to_transfer'
					? 'Request to Transfer'
					: status_uuid.split('_').join(' ').ucwords()
			}`;
		}
		if (sort && order) {
			url += `&sort=${sort}&order=${order}`;
		}
		if (start_date) {
			url += `&start_date=${start_date}`;
		}
		if (end_date) {
			url += `&end_date=${end_date}`;
		}
		if (date_filter_type) {
			url += `&date_filter_type=${date_filter_type}`;
		}
		if (store_uuid) {
			url += `&store_uuid=${store_uuid}`;
		}
		if (floor_area_uuid) {
			url += `&floor_area_uuid=${floor_area_uuid}`;
		}
		if (maintenance_type_uuid) {
			url += `&maintenance_type_uuid=${maintenance_type_uuid}`;
		}
		return apiRequest<TicketListResponse>(url);
	},

	/**
	 * Get Ticket Detail
	 * GET /api/v1/admin/tickets/:id
	 */
	getTicketDetail: async (
		id: string,
		isAdmin = true
	): Promise<TicketDetailResponse> => {
		return apiRequest<TicketDetailResponse>(
			`${isAdmin ? '/admin' : ''}/tickets/${id}`
		);
	},

	/**
	 * Get Ticket Activities
	 * GET /api/v1/admin/tickets/:ticket_id/activities?page=1&page_size=10
	 */
	getTicketActivities: async (
		ticketId: string,
		page: number = 1,
		pageSize: number = 10,
		isAdmin = true
	): Promise<TicketActivityListResponse> => {
		return apiRequest<TicketActivityListResponse>(
			`${
				isAdmin ? '/admin' : ''
			}/tickets/${ticketId}/activities?page=${page}&page_size=${pageSize}`
		);
	},

	/**
	 * Get Ticket Histories
	 * GET /api/v1/admin/tickets/:ticket_id/histories?page=1&page_size=10
	 */
	getTicketHistories: async (
		ticketId: string,
		page: number = 1,
		pageSize: number = 10,
		isAdmin = true
	): Promise<TicketHistoryListResponse> => {
		return apiRequest<TicketHistoryListResponse>(
			`${
				isAdmin ? '/admin' : ''
			}/tickets/${ticketId}/histories?page=${page}&page_size=${pageSize}`
		);
	},

	/**
	 * Get Ticket Status Count
	 * GET /api/v1/admin/tickets/status-count
	 */
	getStatusCount: async (search?: string, isAdmin = true) => {
		return apiRequest<{
			success: boolean;
			message: string;
			data: {
				all: number;
				open: number;
				request_to_transfer: number;
				in_progress: number;
				pending: number;
				breach: number;
				resolved: number;
				assigned: number;
				reject: number;
			};
		}>(
			`${isAdmin ? '/admin' : ''}/tickets/status-count${
				search ? `?search=${search}` : ''
			}`
		);
	},

	/**
	 * Create Activity
	 * POST /api/v1/admin/tickets/:ticket_number/activities
	 */
	createActivity: async (
		ticketNumber: string,
		data: CreateActivityRequest,
		isAdmin = true
	): Promise<CreateActivityResponse> => {
		return apiRequest<CreateActivityResponse>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/activities`,
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * Update Activity
	 * PUT /api/v1/admin/tickets/:ticket_number/activities/:activity_id
	 */
	updateActivity: async (
		ticketNumber: string,
		activityId: string,
		data: UpdateActivityRequest,
		isAdmin = true
	): Promise<UpdateActivityResponse> => {
		return apiRequest<UpdateActivityResponse>(
			`${
				isAdmin ? '/admin' : ''
			}/tickets/${ticketNumber}/activities/${activityId}`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * Assign Ticket
	 * PUT /api/v1/admin/tickets/:ticket_number/assign
	 */
	assignTicket: async (
		ticketNumber: string,
		data: AssignTicketFormData,
		isAdmin = true
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/assign`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * Reject Ticket
	 * PUT /api/v1/admin/tickets/:ticket_number/reject
	 */
	rejectTicket: async (
		ticketNumber: string,
		data: {
			remarks: string;
			reasonId: string;
		},
		isAdmin = true
	): Promise<{ success: boolean; message: string }> => {
		const { reasonId, remarks } = data;
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/reject`,
			{
				method: 'PUT',
				body: JSON.stringify({ remarks, reason_reject_uuid: reasonId }),
			}
		);
	},

	/**
	 * Pending Ticket
	 * PUT /api/v1/admin/tickets/:ticket_number/pending
	 */
	pendingTicket: async (
		ticketNumber: string,
		data: {
			remarks: string;
			reasonId: string;
		},
		isAdmin = true
	): Promise<{ success: boolean; message: string }> => {
		const { reasonId, remarks } = data;
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/pending`,
			{
				method: 'PUT',
				body: JSON.stringify({ remarks, reason_pending_uuid: reasonId }),
			}
		);
	},

	/**
	 * Escalate Ticket
	 * PUT /api/v1/admin/tickets/:ticket_number/escalate
	 */
	escalateTicket: async (
		ticketNumber: string,
		isAdmin = true
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/escalate`,
			{ method: 'POST' }
		);
	},

	/**
	 * Acknowledge Ticket
	 * PUT /api/v1/tickets/:ticket_number/acknowledge
	 */
	acknowledgeTicket: async (
		ticketNumber: string,
		isAdmin = false
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/start`,
			{
				method: 'PUT',
			}
		);
	},

	/**
	 * Resume Ticket
	 * PUT /api/v1/tickets/:ticket_number/resume
	 */
	resumeTicket: async (
		ticketNumber: string,
		isAdmin = false
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/resume`,
			{
				method: 'PUT',
			}
		);
	},

	/**
	 * Resolve Ticket
	 * PUT /api/v1/tickets/:ticket_number/resolve
	 */
	resolveTicket: async (
		ticketNumber: string,
		formData: FormData,
		isAdmin = false
	) => {
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/resolve`,
			{
				method: 'PUT',
				body: formData,
				content: 'form',
			}
		);
	},

	/**
	 * Transfer Ticket
	 * PUT /api/v1/tickets/:ticket_number/transfer
	 */
	transferTicket: async (
		ticketNumber: string,
		data: { reason_transfer_id: string; remarks: string },
		isAdmin = false
	): Promise<{ success: boolean; message: string }> => {
		const { reason_transfer_id, remarks } = data;
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/request-transfer`,
			{
				method: 'PUT',
				body: JSON.stringify({
					reason_transfer_uuid: reason_transfer_id,
					remarks,
				}),
			}
		);
	},

	/**
	 * Complete Activity
	 * PUT /api/v1/tickets/:ticket_number/activities/:activity_id/complete
	 */
	completeActivity: async (
		ticketNumber: string,
		activityId: string,
		isAdmin = false
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`${
				isAdmin ? '/admin' : ''
			}/tickets/${ticketNumber}/activities/${activityId}/complete`,
			{
				method: 'PUT',
			}
		);
	},

	/**
	 * Reject Transfer Ticket
	 * PUT /api/v1/admin/tickets/:ticket_number/reject-transfer
	 */
	rejectTransferTicket: async (
		ticketNumber: string,
		data: {
			remarks: string;
			reasonId: string;
		},
		isAdmin = true
	): Promise<{ success: boolean; message: string }> => {
		const { reasonId, remarks } = data;
		return apiRequest<{ success: boolean; message: string }>(
			`${isAdmin ? '/admin' : ''}/tickets/${ticketNumber}/reject-transfer`,
			{
				method: 'PUT',
				body: JSON.stringify({ remarks, reason_reject_uuid: reasonId }),
			}
		);
	},

	/**
	 * Delete Activity
	 * DELETE /api/v1/admin/tickets/:ticket_number/activities/:activity_uuid
	 */
	deleteActivity: async (
		ticketNumber: string,
		activityId: string,
		isAdmin = true
	): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>(
			`${
				isAdmin ? '/admin' : ''
			}/tickets/${ticketNumber}/activities/${activityId}`,
			{
				method: 'DELETE',
			}
		);
	},

	/**
	 * Export Tickets to Excel
	 * GET /api/v1/admin/tickets/export
	 */
	exportTickets: async (params: TicketExportParams): Promise<Blob> => {
		const cleanParams = Object.entries(params).reduce<MyObject>(
			(ret, [k, v]) => {
				if (v?.toLowerCase?.().includes('all')) return ret;
				if (!v) return ret;

				ret[k] = v;
				return ret;
			},
			{}
		);

		const queryString = toQueryParams(cleanParams);
		return apiRequest(
			`/admin/tickets/export${queryString ? `?${queryString}` : ''}`,
			{ content: 'download' }
		);
	},
};

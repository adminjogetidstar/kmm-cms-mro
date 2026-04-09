/**
 * Global API Service for KMM MRO Backend
 * Base URL: /api/v1
 */

import type {
	LoginRequest,
	LoginResponse,
	RoomAreaListResponse,
	RoomAreaResponse,
	CreateRoomAreaRequest,
	UpdateRoomAreaRequest,
	FloorAreaListResponse,
	FloorAreaResponse,
	CreateFloorAreaRequest,
	UpdateFloorAreaRequest,
	WorkCategoryListResponse,
	WorkCategoryResponse,
	CreateWorkCategoryRequest,
	UpdateWorkCategoryRequest,
	ReasonPendingListResponse,
	ReasonPendingResponse,
	CreateReasonPendingRequest,
	UpdateReasonPendingRequest,
	ReasonTransferListResponse,
	ReasonTransferResponse,
	CreateReasonTransferRequest,
	UpdateReasonTransferRequest,
	ReasonRejectListResponse,
	ReasonRejectResponse,
	CreateReasonRejectRequest,
	UpdateReasonRejectRequest,
	TicketPriorityListResponse,
	TicketPriorityResponse,
	CreateTicketPriorityRequest,
	UpdateTicketPriorityRequest,
	StoreListResponse,
	StoreResponse,
	CreateStoreRequest,
	UpdateStoreRequest,
	UserListResponse,
	UserResponse,
	UserDetailResponse,
	CreateUserRequest,
	UpdateUserRequest,
} from '../types/backend';
import { AssignType } from '../types/backend';
import apiRequest from './helper';

// ============================================================================
// AUTHENTICATION API SERVICE
// ============================================================================

export const authApi = {
	/**
	 * Login
	 * POST /api/v1/auth/login
	 */
	login: async (data: LoginRequest): Promise<LoginResponse> => {
		return apiRequest<LoginResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Logout
	 * POST /api/v1/auth/logout
	 */
	logout: async (): Promise<{ success: boolean; message: string }> => {
		return apiRequest<{ success: boolean; message: string }>('/auth/logout', {
			method: 'POST',
		});
	},
};

// ============================================================================
// ROLE API SERVICE
// ============================================================================

export * from './roles';

// ============================================================================
// MENU API SERVICE
// ============================================================================

export * from './menus';

// ============================================================================
// LOCATION API SERVICE
// ============================================================================

export * from './locations';

// ============================================================================
// STORE API SERVICE
// ============================================================================

export const storeApi = {
	/**
	 * Get All Stores (Active)
	 * GET /api/v1/stores/active?page=1&page_size=10&sort=store_name&order=ASC&store_name=search
	 */
	getAllStores: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<StoreListResponse> => {
		let url = `/stores/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&search=${searchTerm}`;
		}
		return apiRequest<StoreListResponse>(url);
	},

	/**
	 * Get Store by UUID
	 * GET /api/v1/stores/:uuid
	 */
	getStoreByUUID: async (
		uuid: string
	): Promise<{ Success: boolean; message: string; data: StoreResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: StoreResponse;
		}>(`/stores/${uuid}`);
	},

	/**
	 * Create Store
	 * POST /api/v1/stores
	 */
	createStore: async (
		data: CreateStoreRequest
	): Promise<{ Success: boolean; message: string; data: StoreResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: StoreResponse;
		}>('/stores', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Store
	 * PUT /api/v1/stores/:uuid
	 */
	updateStore: async (
		uuid: string,
		data: UpdateStoreRequest
	): Promise<{ Success: boolean; message: string; data: StoreResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: StoreResponse;
		}>(`/stores/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Store
	 * DELETE /api/v1/stores/:uuid
	 */
	deleteStore: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/stores/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// WORK CATEGORY API SERVICE
// ============================================================================

export * from './workCategories';

export const workCategoryApi = {
	/**
	 * Get All Work Categories (Active)
	 * GET /api/v1/work-categories/active?page=1&page_size=10&sort=category_name&order=&category_name=&category_code=
	 */
	getAllWorkCategories: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<WorkCategoryListResponse> => {
		let url = `/work-categories/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&category_name=${searchTerm}&category_code=${searchTerm}`;
		}
		return apiRequest<WorkCategoryListResponse>(url);
	},

	/**
	 * Get Work Category by UUID
	 * GET /api/v1/work-categories/:uuid
	 */
	getWorkCategoryByUUID: async (
		uuid: string
	): Promise<{
		Success: boolean;
		message: string;
		data: WorkCategoryResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: WorkCategoryResponse;
		}>(`/work-categories/${uuid}`);
	},

	/**
	 * Create Work Category
	 * POST /api/v1/work-categories
	 */
	createWorkCategory: async (
		data: CreateWorkCategoryRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: WorkCategoryResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: WorkCategoryResponse;
		}>('/work-categories', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Work Category
	 * PUT /api/v1/work-categories/:uuid
	 */
	updateWorkCategory: async (
		uuid: string,
		data: UpdateWorkCategoryRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: WorkCategoryResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: WorkCategoryResponse;
		}>(`/work-categories/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Work Category
	 * DELETE /api/v1/work-categories/:uuid
	 */
	deleteWorkCategory: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/work-categories/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// FLOOR AREA API SERVICE
// ============================================================================

export * from './floorAreas';

export const floorAreaApi = {
	/**
	 * Get All Floor Areas (Active)
	 * GET /api/v1/floor-areas/active?page=1&page_size=10&sort=floor_area_name&order=&floor_area_name=
	 */
	getAllFloorAreas: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<FloorAreaListResponse> => {
		let url = `/floor-areas/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&floor_area_name=${searchTerm}`;
		}
		return apiRequest<FloorAreaListResponse>(url);
	},

	/**
	 * Get Floor Area by UUID
	 * GET /api/v1/floor-areas/:uuid
	 */
	getFloorAreaByUUID: async (
		uuid: string
	): Promise<{
		Success: boolean;
		message: string;
		data: FloorAreaResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: FloorAreaResponse;
		}>(`/floor-areas/${uuid}`);
	},

	/**
	 * Create Floor Area
	 * POST /api/v1/floor-areas
	 */
	createFloorArea: async (
		data: CreateFloorAreaRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: FloorAreaResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: FloorAreaResponse;
		}>('/floor-areas', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Floor Area
	 * PUT /api/v1/floor-areas/:uuid
	 */
	updateFloorArea: async (
		uuid: string,
		data: UpdateFloorAreaRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: FloorAreaResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: FloorAreaResponse;
		}>(`/floor-areas/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Floor Area
	 * DELETE /api/v1/floor-areas/:uuid
	 */
	deleteFloorArea: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/floor-areas/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// ROOM AREA API SERVICE
// ============================================================================

export * from './roomAreas';

export const roomAreaApi = {
	/**
	 * Get All Room Areas (Active)
	 * GET /api/v1/room-areas/active?page=1&page_size=10&sort=room_area_name&order=&room_area_name=
	 */
	getAllRoomAreas: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<RoomAreaListResponse> => {
		let url = `/room-areas/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&room_area_name=${searchTerm}`;
		}
		return apiRequest<RoomAreaListResponse>(url);
	},

	/**
	 * Get Room Area by UUID
	 * GET /api/v1/room-areas/:uuid
	 */
	getRoomAreaByUUID: async (
		uuid: string
	): Promise<{ Success: boolean; message: string; data: RoomAreaResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: RoomAreaResponse;
		}>(`/room-areas/${uuid}`);
	},

	/**
	 * Create Room Area
	 * POST /api/v1/room-areas
	 */
	createRoomArea: async (
		data: CreateRoomAreaRequest
	): Promise<{ Success: boolean; message: string; data: RoomAreaResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: RoomAreaResponse;
		}>('/room-areas', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Room Area
	 * PUT /api/v1/room-areas/:uuid
	 */
	updateRoomArea: async (
		uuid: string,
		data: UpdateRoomAreaRequest
	): Promise<{ Success: boolean; message: string; data: RoomAreaResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: RoomAreaResponse;
		}>(`/room-areas/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Room Area
	 * DELETE /api/v1/room-areas/:uuid
	 */
	deleteRoomArea: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/room-areas/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// REASON PENDING API SERVICE
// ============================================================================

export const reasonPendingApi = {
	/**
	 * Get All Reason Pendings (Active)
	 * GET /api/v1/reason-pendings/active?page=1&page_size=10&sort=reason_pending_name&order=&reason_pending_name=
	 */
	getAllReasonPendings: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<ReasonPendingListResponse> => {
		let url = `/reason-pendings/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&search=${searchTerm}`;
		}
		return apiRequest<ReasonPendingListResponse>(url);
	},

	/**
	 * Get Reason Pending by UUID
	 * GET /api/v1/reason-pendings/:uuid
	 */
	getReasonPendingByUUID: async (
		uuid: string
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonPendingResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonPendingResponse;
		}>(`/reason-pendings/${uuid}`);
	},

	/**
	 * Create Reason Pending
	 * POST /api/v1/reason-pendings
	 */
	createReasonPending: async (
		data: CreateReasonPendingRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonPendingResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonPendingResponse;
		}>('/reason-pendings', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Reason Pending
	 * PUT /api/v1/reason-pendings/:uuid
	 */
	updateReasonPending: async (
		uuid: string,
		data: UpdateReasonPendingRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonPendingResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonPendingResponse;
		}>(`/reason-pendings/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Reason Pending
	 * DELETE /api/v1/reason-pendings/:uuid
	 */
	deleteReasonPending: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/reason-pendings/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// REASON TRANSFER API SERVICE
// ============================================================================

export const reasonTransferApi = {
	/**
	 * Get All Reason Transfers (Active)
	 * GET /api/v1/reason-transfers/active?page=1&page_size=10&sort=reason_transfer_name&order=&reason_transfer_name=
	 */
	getAllReasonTransfers: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<ReasonTransferListResponse> => {
		let url = `/reason-transfers/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&reason_transfer_name=${searchTerm}`;
		}
		return apiRequest<ReasonTransferListResponse>(url);
	},

	/**
	 * Get Reason Transfer by UUID
	 * GET /api/v1/reason-transfers/:uuid
	 */
	getReasonTransferByUUID: async (
		uuid: string
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonTransferResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonTransferResponse;
		}>(`/reason-transfers/${uuid}`);
	},

	/**
	 * Create Reason Transfer
	 * POST /api/v1/reason-transfers
	 */
	createReasonTransfer: async (
		data: CreateReasonTransferRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonTransferResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonTransferResponse;
		}>('/reason-transfers', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Reason Transfer
	 * PUT /api/v1/reason-transfers/:uuid
	 */
	updateReasonTransfer: async (
		uuid: string,
		data: UpdateReasonTransferRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonTransferResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonTransferResponse;
		}>(`/reason-transfers/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Reason Transfer
	 * DELETE /api/v1/reason-transfers/:uuid
	 */
	deleteReasonTransfer: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/reason-transfers/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// REASON REJECT API SERVICE
// ============================================================================

export const reasonRejectApi = {
	/**
	 * Get All Reason Rejects (Active)
	 * GET /api/v1/reason-rejects/active?page=1&page_size=10&sort=reason_reject_name&order=&reason_reject_name=
	 */
	getAllReasonRejects: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<ReasonRejectListResponse> => {
		let url = `/reason-rejects/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&reason_reject_name=${searchTerm}`;
		}
		return apiRequest<ReasonRejectListResponse>(url);
	},

	/**
	 * Get Reason Reject by UUID
	 * GET /api/v1/reason-rejects/:uuid
	 */
	getReasonRejectByUUID: async (
		uuid: string
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonRejectResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonRejectResponse;
		}>(`/reason-rejects/${uuid}`);
	},

	/**
	 * Create Reason Reject
	 * POST /api/v1/reason-rejects
	 */
	createReasonReject: async (
		data: CreateReasonRejectRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonRejectResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonRejectResponse;
		}>('/reason-rejects', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Reason Reject
	 * PUT /api/v1/reason-rejects/:uuid
	 */
	updateReasonReject: async (
		uuid: string,
		data: UpdateReasonRejectRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: ReasonRejectResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: ReasonRejectResponse;
		}>(`/reason-rejects/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Reason Reject
	 * DELETE /api/v1/reason-rejects/:uuid
	 */
	deleteReasonReject: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/reason-rejects/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// TICKET PRIORITY API SERVICE
// ============================================================================

export const ticketPriorityApi = {
	/**
	 * Get All Ticket Priorities (Active)
	 * GET /api/v1/ticket-priorities/active?page=1&page_size=10&sort=priority_name&order=&priority_name=
	 */
	getAllTicketPriorities: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<TicketPriorityListResponse> => {
		let url = `/ticket-priorities/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&search=${searchTerm}`;
		}
		return apiRequest<TicketPriorityListResponse>(url);
	},

	/**
	 * Get Ticket Priority by UUID
	 * GET /api/v1/ticket-priorities/:uuid
	 */
	getTicketPriorityByUUID: async (
		uuid: string
	): Promise<{
		Success: boolean;
		message: string;
		data: TicketPriorityResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: TicketPriorityResponse;
		}>(`/ticket-priorities/${uuid}`);
	},

	/**
	 * Create Ticket Priority
	 * POST /api/v1/ticket-priorities
	 */
	createTicketPriority: async (
		data: CreateTicketPriorityRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: TicketPriorityResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: TicketPriorityResponse;
		}>('/ticket-priorities', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Ticket Priority
	 * PUT /api/v1/ticket-priorities/:uuid
	 */
	updateTicketPriority: async (
		uuid: string,
		data: UpdateTicketPriorityRequest
	): Promise<{
		Success: boolean;
		message: string;
		data: TicketPriorityResponse;
	}> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: TicketPriorityResponse;
		}>(`/ticket-priorities/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Ticket Priority
	 * DELETE /api/v1/ticket-priorities/:uuid
	 */
	deleteTicketPriority: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/ticket-priorities/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
};

// ============================================================================
// USER (ACCOUNT) API SERVICE
// ============================================================================

export const userApi = {
	/**
	 * Get All Active Users
	 * GET /api/v1/users/active?page=1&page_size=10&sort=employee_id&order=ASC
	 */
	getAllUsers: async (
		page: number = 1,
		pageSize: number = 10,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC',
		store_uuid?: string[]
	): Promise<UserListResponse> => {
		let url = `/users/active?page=${page}&page_size=${pageSize}`;
		if (sortBy && sortOrder) {
			url += `&sort=${sortBy}&order=${sortOrder}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			// Search across multiple fields
			url += `&search=${searchTerm}`;
		}
		if (store_uuid) {
			url += `&store_uuid=${store_uuid}`;
		}
		return apiRequest<UserListResponse>(url);
	},

	/**
	 * Get User by UUID
	 * GET /api/v1/users/:uuid
	 */
	getUserByUUID: async (uuid: string): Promise<UserDetailResponse> => {
		return apiRequest<UserDetailResponse>(`/users/${uuid}`);
	},

	/**
	 * Create User
	 * POST /api/v1/users
	 */
	createUser: async (data: CreateUserRequest) => {
		return apiRequest<{ data: { setup_link: string } }>('/users', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update User
	 * PUT /api/v1/users/:uuid
	 */
	updateUser: async (
		uuid: string,
		data: UpdateUserRequest
	): Promise<UserResponse> => {
		return apiRequest<UserResponse>(`/users/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete User
	 * DELETE /api/v1/users/:uuid
	 */
	deleteUser: async (uuid: string, lastActionBy: string): Promise<void> => {
		return apiRequest<void>(`/users/${uuid}`, {
			method: 'DELETE',
			body: JSON.stringify({
				last_action_by: lastActionBy,
			}),
		});
	},

	/**
	 * Set User Password
	 * POST /api/v1/users/password/set
	 */
	setPassword: async (data: {
		token: string;
		password: string;
		confirm_password: string;
	}): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			'/users/password/set',
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * Set User Password
	 * POST /api/v1/users/password/reset
	 */
	resetPassword: async (data: {
		token: string;
		new_password: string;
		confirm_password: string;
	}) => {
		return apiRequest<{ Success: boolean; message: string }>(
			'/users/password/reset',
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * Forgot Password
	 * POST /api/v1/users/password/resend
	 */
	forgotPassword: async ({
		email,
	}: {
		email: string;
	}): Promise<{ message: string }> => {
		return apiRequest<{ message: string }>('/users/password/forgot', {
			method: 'POST',
			body: JSON.stringify({ email, last_action_by: email }),
		});
	},
};

// ============================================================================
// ASSIGNEE API SERVICE
// ============================================================================

export const assigneeApi = {
	/**
	 * Get Assignees by Type
	 * GET /api/v1/assignees?type=vendor|internal
	 */
	getAssignees: async (type: AssignType) => {
		return apiRequest<{
			total: number;
			data:
				| null
				| {
						uuid: string;
						name: string;
						pic_name?: string;
						pic_contact?: string;
				  }[];
		}>(`/assignees?type=${type}`);
	},
};

// ============================================================================
// PROFILE API SERVICE
// ============================================================================

export * from './profile';

// ============================================================================
// TICKET API SERVICE
// ============================================================================

export * from './ticketDetail';

// ============================================================================
// DASHBOARD API SERVICE
// ============================================================================

export * from './dashboard';

// ============================================================================
// NOTIFICATION API SERVICE
// ============================================================================

export * from './notification';

// Export all API services
export default {
	auth: authApi,
	// location: locationApi,
	store: storeApi,
	workCategory: workCategoryApi,
	floorArea: floorAreaApi,
	roomArea: roomAreaApi,
	reasonPending: reasonPendingApi,
	reasonTransfer: reasonTransferApi,
	reasonReject: reasonRejectApi,
	ticketPriority: ticketPriorityApi,
	user: userApi,
	assignee: assigneeApi,
	// Add other services here as they are implemented
};

/**
 * API Documentation for KMM MRO Backend
 * Base URL: /api/v1
 *
 * This file contains all TypeScript interfaces for request and response objects
 * for the Ticket Support Management System Backend API
 */

import { BadgeType } from '@shared/components';

// ============================================================================
// 1. AUTHENTICATION INTERFACES
// ============================================================================

export type TicketStatus =
	| 'open'
	| 'assigned'
	| 'inprogress'
	| 'in progress'
	| 'closed'
	| 'pending'
	| 'resolved'
	| 'request_to_transfer'
	| 'transferred'
	| 'rejected';
export type Priority = 'low' | 'medium' | 'high';

export enum AssignType {
	VENDOR = 'vendor',
	INTERNAL = 'internal',
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		access_token: string;
		refresh_token: string;
		user: UserResponse;
	};
}

export interface RefreshTokenRequest {
	refresh_token: string;
}

export interface RefreshTokenResponse {
	success: boolean;
	message: string;
	data: {
		access_token: string;
	};
}

export interface ProfileResponse {
	success: boolean;
	message: string;
	data: UserResponse;
}

/**
 * AUTHENTICATION ENDPOINTS:
 *
 * POST   /api/v1/auth/login       - Login
 * POST   /api/v1/auth/refresh     - Refresh Token
 * GET    /api/v1/auth/profile     - Get Profile (Protected)
 * POST   /api/v1/auth/logout      - Logout (Protected)
 */

// ============================================================================
// 2. ROLE INTERFACES
// ============================================================================

export interface CreateRoleRequest {
	role_name: string; // min: 3, max: 100
	role_code: string; // min: 2, max: 10
	last_action_by: string; // required
}

export interface UpdateRoleRequest {
	role_name: string; // min: 3, max: 100
	last_action_by: string; // required
	is_active?: boolean;
	menus?: {
		uuid: string;
		can_view: boolean;
		can_create: boolean;
		can_read: boolean;
		can_update: boolean;
		can_delete: boolean;
		can_pending: boolean;
		can_transfer: boolean;
	}[];
}

export interface MenuPermission {
	menu_id: number;
	uuid: string;
	menu_name: string;
	url_menu: string;
	can_create: boolean;
	can_read: boolean;
	can_update: boolean;
	can_delete: boolean;
	// can_view: boolean;
	// can_pending: boolean;
	// can_transfer: boolean;
}

export interface RoleResponse {
	uuid: string;
	role_name: string;
	role_code: string;
	is_active: boolean;
}

export interface RoleDetailResponse {
	Success: boolean;
	message: string;
	data: {
		uuid: string;
		role_name: string;
		role_code: string;
		menus: MenuPermission[];
	};
}

export interface RoleListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: RoleResponse[];
	};
}

/**
 * ROLE ENDPOINTS:
 * Protected by: AuthMiddleware + RequireRole("SUPER", "ADMIN")
 *
 * POST   /api/v1/roles         - Create Role
 * GET    /api/v1/roles         - Get All Roles
 * GET    /api/v1/roles/active  - Get Active Roles
 * GET    /api/v1/roles/:uuid   - Get Role by UUID
 * PUT    /api/v1/roles/:uuid   - Update Role
 * DELETE /api/v1/roles/:uuid   - Delete Role
 */

// ============================================================================
// 3. MENU INTERFACES
// ============================================================================

export interface CreateMenuRequest {
	menu_name: string; // min: 3, max: 100
	url_menu?: string; // max: 255
	parent_menu_id?: number | null;
	menu_order_id: number; // min: 0
	last_action_by: string; // required
}

export interface UpdateMenuRequest {
	menu_name: string; // min: 3, max: 100
	url_menu?: string; // max: 255
	parent_menu_id?: number | null;
	menu_order_id: number; // min: 0
	last_action_by: string; // required
	is_active?: boolean | null;
}

export interface MenuResponse {
	uuid: string;
	menu_name: string;
	url_menu: string;
	parent_menu_id: number | null;
	menu_order_id: number;
}

export interface MenuWithSubMenusResponse {
	uuid: string;
	menu_name: string;
	url_menu: string;
	menu_order_id: number;
	sub_menus?: MenuWithSubMenusResponse[];
}

export interface MenuListResponse {
	total: number;
	data: MenuResponse[];
}

export interface ActiveMenusResponse {
	success: boolean;
	message: string;
	data: {
		total: number;
		data: MenuResponse[];
	};
}

export interface MenuHierarchyResponse {
	success: boolean;
	message: string;
	data: {
		total: number;
		data: MenuWithSubMenusResponse[];
	};
}

/**
 * MENU ENDPOINTS:
 *
 * POST   /api/v1/menus                    - Create Menu (menuHandler.CreateMenu)
 * GET    /api/v1/menus                    - Get All Menus (menuHandler.GetAllMenus)
 * GET    /api/v1/menus/active             - Get Active Menus (menuHandler.GetAllActiveMenus)
 * GET    /api/v1/menus/parents            - Get Parent Menus (menuHandler.GetParentMenus)
 * GET    /api/v1/menus/hierarchy          - Get Menu Hierarchy (menuHandler.GetMenuHierarchy)
 * GET    /api/v1/menus/:uuid              - Get Menu by UUID (menuHandler.GetMenuByUUID)
 * GET    /api/v1/menus/:uuid/submenus     - Get Sub Menus (menuHandler.GetSubMenus)
 * PUT    /api/v1/menus/:uuid              - Update Menu (menuHandler.UpdateMenu)
 * PATCH  /api/v1/menus/:uuid/deactivate   - Deactivate Menu (menuHandler.DeactivateMenu)
 */

// ============================================================================
// 4. LOCATION INTERFACES
// ============================================================================
export type LocationType =
	| 'country'
	| 'province'
	| 'city'
	| 'district'
	| 'sub-district';

export interface LocationResponse {
	uuid: string;
	location_name: string;
	type: LocationType;
	parent_name?: string;
	parent_uuid?: string;
}

export interface LocationListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: LocationResponse[];
	};
}

export interface CreateLocationRequest {
	location_name: string; // min: 3, max: 200
	parent_location_id?: number | null;
	last_action_by: string; // required
}

export interface UpdateLocationRequest {
	location_name: string; // min: 3, max: 200
	parent_location_id?: number | null;
	last_action_by: string; // required
	is_deleted?: boolean | null;
}

export interface LocationResponse {
	uuid: string;
	location_name: string;
}

export interface LocationWithParentResponse {
	uuid: string;
	location_name: string;
	parent_name?: string;
}

export interface LocationSearchResponse {
	total: number;
	data: LocationWithParentResponse[];
}

/**
 * LOCATION ENDPOINTS:
 *
 * POST   /api/v1/locations                         - Create Location
 * GET    /api/v1/locations                         - Get All Locations
 * GET    /api/v1/locations/active                  - Get Active Locations
 * GET    /api/v1/locations/parents                 - Get Parent Locations
 * GET    /api/v1/locations/search                  - Search Locations
 * GET    /api/v1/locations/:uuid                   - Get Location by UUID
 * GET    /api/v1/locations/sublocations/:parentUUID - Get Sub Locations
 * PUT    /api/v1/locations/:uuid                   - Update Location
 * DELETE /api/v1/locations/:uuid                   - Delete Location
 * GET    /api/v1/locations/:uuid/hierarchy         - Get Location Hierarchy
 */

// ============================================================================
// 5. STORE INTERFACES
// ============================================================================

export interface CreateStoreRequest {
	code: string; // min: 3, max: 50
	store_name: string; // min: 3, max: 200
	address?: string; // max: 500
	uuid: string; // Location UUID (required)
	postal_code?: string; // max: 20
	country?: string; // max: 100
	phone?: string; // max: 50
	email?: string; // email format, max: 100
	last_action_by: string; // required
}

export interface UpdateStoreRequest {
	store_name: string; // min: 3, max: 200
	address?: string; // max: 500
	uuid: string; // Location UUID (required)
	postal_code?: string; // max: 20
	country?: string; // max: 100
	phone?: string; // max: 50
	email?: string; // email format, max: 100
	is_store_belongs: boolean;
	last_action_by: string; // required
	is_active?: boolean | null;
}

export interface StoreResponse {
	uuid: string;
	code: string;
	store_name: string;
	address: string;
	postal_code: string;
	country: string;
	phone: string;
	email: string;
	location_name?: string;
	location_uuid?: string;
}

export interface StoreWithLocationResponse {
	uuid: string;
	code: string;
	store_name: string;
	address: string;
	location_name: string;
	postal_code: string;
	country: string;
	phone: string;
	email: string;
	location_uuid?: string;
}

export interface StoreListResponse {
	current_page: number;
	page_size: number;
	total_pages: number;
	total_records: number;
	has_next: boolean;
	has_prev: boolean;
	data: StoreResponse[];
}

export interface StoreWithLocationListResponse {
	current_page: number;
	page_size: number;
	total_pages: number;
	total_records: number;
	has_next: boolean;
	has_prev: boolean;
	data: StoreWithLocationResponse[];
}

export interface StoreStatsByLocationResponse {
	location_name: string;
	store_count: number;
}

/**
 * STORE ENDPOINTS:
 * Protected by: AuthMiddleware
 * Write operations require: RequireRole("ADMIN", "SUPER_ADMIN")
 *
 * GET    /api/v1/stores                        - Get All Stores
 * GET    /api/v1/stores/active                 - Get Active Stores
 * GET    /api/v1/stores/search                 - Search Stores
 * GET    /api/v1/stores/code/:code             - Get Store by Code
 * GET    /api/v1/stores/location/:uuid         - Get Stores by Location
 * GET    /api/v1/stores/location/:uuid/search  - Search Stores by Location
 * GET    /api/v1/stores/:uuid                  - Get Store by UUID
 * POST   /api/v1/stores                        - Create Store (ADMIN only)
 * PUT    /api/v1/stores/:uuid                  - Update Store (ADMIN only)
 * DELETE /api/v1/stores/:uuid                  - Delete Store (ADMIN only)
 */

// ============================================================================
// 6. WORK CATEGORY INTERFACES
// ============================================================================

export interface CreateWorkCategoryRequest {
	category_name: string; // min: 3, max: 100
	category_code: string; // min: 2, max: 50
	last_action_by: string; // required
}

export interface UpdateWorkCategoryRequest {
	category_name: string; // min: 3, max: 100
	last_action_by: string; // required
}

export interface WorkCategoryResponse {
	uuid: string;
	category_name: string;
	category_code: string;
}

export interface WorkCategoryListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: WorkCategoryResponse[];
	};
}

/**
 * WORK CATEGORY ENDPOINTS:
 *
 * POST   /api/v1/work-categories             - Create Work Category
 * GET    /api/v1/work-categories             - Get All Work Categories
 * GET    /api/v1/work-categories/active      - Get Active Work Categories
 * GET    /api/v1/work-categories/search      - Search Work Categories
 * GET    /api/v1/work-categories/:uuid       - Get Work Category by UUID
 * GET    /api/v1/work-categories/code/:code  - Get Work Category by Code
 * PUT    /api/v1/work-categories/:uuid       - Update Work Category
 * DELETE /api/v1/work-categories/:uuid       - Delete Work Category
 */

// ============================================================================
// 7. FLOOR AREA INTERFACES
// ============================================================================

export interface CreateFloorAreaRequest {
	floor_area_name: string; // min: 2, max: 100
	last_action_by: string; // required
}

export interface UpdateFloorAreaRequest {
	floor_area_name: string; // min: 2, max: 100
	last_action_by: string; // required
}

export interface FloorAreaResponse {
	uuid: string;
	floor_area_name: string;
}

export interface FloorAreaListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: FloorAreaResponse[];
	};
}

/**
 * FLOOR AREA ENDPOINTS:
 * Protected by: AuthMiddleware + RequireRole("SUPER", "ADMIN")
 *
 * POST   /api/v1/floor-areas             - Create Floor Area
 * GET    /api/v1/floor-areas             - Get All Floor Areas
 * GET    /api/v1/floor-areas/active      - Get Active Floor Areas
 * GET    /api/v1/floor-areas/search      - Search Floor Areas
 * GET    /api/v1/floor-areas/:uuid       - Get Floor Area by UUID
 * PUT    /api/v1/floor-areas/:uuid       - Update Floor Area
 * DELETE /api/v1/floor-areas/:uuid       - Delete Floor Area
 */

// ============================================================================
// 8. ROOM AREA INTERFACES
// ============================================================================

export interface CreateRoomAreaRequest {
	room_area_name: string; // min: 2, max: 100
	last_action_by: string; // required
}

export interface UpdateRoomAreaRequest {
	room_area_name: string; // min: 2, max: 100
	last_action_by: string; // required
}

export interface RoomAreaResponse {
	uuid: string;
	room_area_name: string;
}

export interface RoomAreaListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: RoomAreaResponse[];
	};
}

/**
 * ROOM AREA ENDPOINTS:
 *
 * POST   /api/v1/room-areas             - Create Room Area
 * GET    /api/v1/room-areas             - Get All Room Areas
 * GET    /api/v1/room-areas/active      - Get Active Room Areas
 * GET    /api/v1/room-areas/search      - Search Room Areas
 * GET    /api/v1/room-areas/:uuid       - Get Room Area by UUID
 * PUT    /api/v1/room-areas/:uuid       - Update Room Area
 * DELETE /api/v1/room-areas/:uuid       - Delete Room Area
 */

// ============================================================================
// 9. REASON PENDING INTERFACES
// ============================================================================

export interface CreateReasonPendingRequest {
	reason_pending_name: string;
	time_limit: number;
	last_action_by: string;
}

export interface UpdateReasonPendingRequest {
	reason_pending_name: string;
	time_limit: number;
	last_action_by: string;
}

export interface ReasonPendingResponse {
	uuid: string;
	reason_pending_name: string;
	time_limit: number;
}

export interface ReasonPendingListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: ReasonPendingResponse[];
	};
}

/**
 * REASON PENDING ENDPOINTS:
 *
 * POST   /api/v1/reason-pendings             - Create Reason Pending
 * GET    /api/v1/reason-pendings             - Get All Reason Pendings
 * GET    /api/v1/reason-pendings/active      - Get Active Reason Pendings
 * GET    /api/v1/reason-pendings/search      - Search Reason Pendings
 * GET    /api/v1/reason-pendings/:uuid       - Get Reason Pending by UUID
 * PUT    /api/v1/reason-pendings/:uuid       - Update Reason Pending
 * DELETE /api/v1/reason-pendings/:uuid       - Delete Reason Pending
 */

// ============================================================================
// 10. REASON TRANSFER INTERFACES
// ============================================================================

export interface CreateReasonTransferRequest {
	reason_transfer_name: string;
	time_limit: number;
	last_action_by: string;
}

export interface UpdateReasonTransferRequest {
	reason_transfer_name: string;
	time_limit: number;
	last_action_by: string;
}

export interface ReasonTransferResponse {
	uuid: string;
	reason_transfer_name: string;
	time_limit: number;
}

export interface ReasonTransferListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: ReasonTransferResponse[];
	};
}

/**
 * REASON TRANSFER ENDPOINTS:
 *
 * POST   /api/v1/reason-transfers             - Create Reason Transfer
 * GET    /api/v1/reason-transfers             - Get All Reason Transfers
 * GET    /api/v1/reason-transfers/active      - Get Active Reason Transfers
 * GET    /api/v1/reason-transfers/search      - Search Reason Transfers
 * GET    /api/v1/reason-transfers/:uuid       - Get Reason Transfer by UUID
 * PUT    /api/v1/reason-transfers/:uuid       - Update Reason Transfer
 * DELETE /api/v1/reason-transfers/:uuid       - Delete Reason Transfer
 */

// ============================================================================
// 11. REASON REJECT INTERFACES
// ============================================================================

export interface CreateReasonRejectRequest {
	reason_reject_name: string;
	last_action_by: string;
}

export interface UpdateReasonRejectRequest {
	reason_reject_name: string;
	last_action_by: string;
}

export interface ReasonRejectResponse {
	uuid: string;
	reason_reject_name: string;
}

export interface ReasonRejectListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: ReasonRejectResponse[];
	};
}

/**
 * REASON REJECT ENDPOINTS:
 *
 * POST   /api/v1/reason-rejects             - Create Reason Reject
 * GET    /api/v1/reason-rejects             - Get All Reason Rejects
 * GET    /api/v1/reason-rejects/active      - Get Active Reason Rejects
 * GET    /api/v1/reason-rejects/search      - Search Reason Rejects
 * GET    /api/v1/reason-rejects/:uuid       - Get Reason Reject by UUID
 * PUT    /api/v1/reason-rejects/:uuid       - Update Reason Reject
 * DELETE /api/v1/reason-rejects/:uuid       - Delete Reason Reject
 */

// ============================================================================
// 12. TICKET PRIORITY INTERFACES
// ============================================================================

export interface CreateTicketPriorityRequest {
	priority_code: string; // uppercase version of priority_name
	priority_name: string; // min: 2, max: 50
	priority_level: number; // min: 1
	sla_response_time?: number | null; // in hours
	sla_resolution_time?: number | null; // in days
	description?: string | null;
	color_code?: string | null; // hex color (#RRGGBB)
	last_action_by: string; // required
}

export interface UpdateTicketPriorityRequest {
	priority_code: string; // uppercase version of priority_name
	priority_name: string; // min: 2, max: 50
	priority_level: number; // min: 1
	sla_response_time?: number | null; // in hours
	sla_resolution_time?: number | null; // in days
	description?: string | null;
	color_code?: string | null;
	last_action_by: string; // required
}

export interface TicketPriorityResponse {
	uuid: string;
	priority_code: string;
	priority_name: string;
	priority_level: number;
	description?: string;
	sla_response_time: number | null;
	sla_resolution_time: number | null;
	color_code?: string | null;
}

export interface TicketPriorityListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: TicketPriorityResponse[];
	};
}

// Frontend type for TicketPriority (used in components)
export interface TicketPriority {
	id: string;
	uuid: string;
	priority_code: string;
	priority_name: string;
	priority_level: number;
	description: string;
	sla_response_time: number;
	sla_resolution_time: number;
}

/**
 * TICKET PRIORITY ENDPOINTS:
 *
 * POST   /api/v1/ticket-priorities              - Create Ticket Priority
 * GET    /api/v1/ticket-priorities              - Get All Ticket Priorities
 * GET    /api/v1/ticket-priorities/active       - Get Active Ticket Priorities
 * GET    /api/v1/ticket-priorities/high         - Get High Priorities
 * GET    /api/v1/ticket-priorities/search       - Search Ticket Priorities
 * GET    /api/v1/ticket-priorities/:uuid        - Get Ticket Priority by UUID
 * GET    /api/v1/ticket-priorities/code/:code   - Get Ticket Priority by Code
 * GET    /api/v1/ticket-priorities/level/:level - Get Ticket Priority by Level
 * PUT    /api/v1/ticket-priorities/:uuid        - Update Ticket Priority
 * DELETE /api/v1/ticket-priorities/:uuid        - Delete Ticket Priority
 */

// ============================================================================
// 13. SLA PENDING INTERFACES
// ============================================================================

export interface CreateSLAPendingRequest {
	sla_pending_name: string;
	time_limit: number;
	last_action_by: string;
}

export interface UpdateSLAPendingRequest {
	sla_pending_name: string;
	time_limit: number;
	last_action_by: string;
}

export interface SLAPendingResponse {
	uuid: string;
	sla_pending_name: string;
	time_limit: number;
}

export interface SLAPendingListResponse {
	Success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: SLAPendingResponse[];
	};
}

/**
 * SLA PENDING ENDPOINTS:
 *
 * POST   /api/v1/sla-pendings             - Create SLA Pending
 * GET    /api/v1/sla-pendings             - Get All SLA Pendings
 * GET    /api/v1/sla-pendings/active      - Get Active SLA Pendings
 * GET    /api/v1/sla-pendings/search      - Search SLA Pendings
 * GET    /api/v1/sla-pendings/:uuid       - Get SLA Pending by UUID
 * PUT    /api/v1/sla-pendings/:uuid       - Update SLA Pending
 * DELETE /api/v1/sla-pendings/:uuid       - Delete SLA Pending
 */

// ============================================================================
// 14. ROLE MENU INTERFACES
// ============================================================================

export interface AssignMenuToRoleRequest {
	role_id: number;
	menu_id: number;
	can_view: boolean;
	can_create: boolean;
	can_read: boolean;
	can_update: boolean;
	can_delete: boolean;
	can_pending: boolean;
	can_transfer: boolean;
	last_action_by: string;
}

export interface AssignMultipleMenusToRoleRequest {
	role_id: number;
	menus: {
		menu_id: number;
		can_view: boolean;
		can_create: boolean;
		can_read: boolean;
		can_update: boolean;
		can_delete: boolean;
		can_pending: boolean;
		can_transfer: boolean;
	}[];
	last_action_by: string;
}

export interface UpdateRoleMenuRequest {
	can_view: boolean;
	can_create: boolean;
	can_read: boolean;
	can_update: boolean;
	can_delete: boolean;
	can_pending: boolean;
	can_transfer: boolean;
	last_action_by: string;
}

export interface RoleMenuResponse {
	id: number;
	uuid: string;
	role_id: number;
	menu_id: number;
	role_name: string;
	menu_name: string;
	can_view: boolean;
	can_create: boolean;
	can_read: boolean;
	can_update: boolean;
	can_delete: boolean;
	can_pending: boolean;
	can_transfer: boolean;
}

export interface RoleMenuListResponse {
	total: number;
	data: RoleMenuResponse[];
}

/**
 * ROLE MENU ENDPOINTS:
 *
 * POST   /api/v1/role-menus                          - Assign Menu to Role
 * POST   /api/v1/role-menus/bulk                     - Assign Multiple Menus to Role
 * GET    /api/v1/role-menus                          - Get All Role Menus
 * GET    /api/v1/role-menus/active                   - Get All Active Role Menus
 * GET    /api/v1/role-menus/:id                      - Get Role Menu by ID
 * GET    /api/v1/role-menus/uuid/:uuid               - Get Role Menu by UUID
 * GET    /api/v1/role-menus/role/:roleId             - Get Menus by Role ID
 * GET    /api/v1/role-menus/menu/:menuId             - Get Roles by Menu ID
 * PUT    /api/v1/role-menus/:id                      - Update Role Menu
 * DELETE /api/v1/role-menus/:id                      - Delete Role Menu
 * DELETE /api/v1/role-menus/role/:roleId             - Remove All Menus from Role
 * DELETE /api/v1/role-menus/role/:roleId/menu/:menuId - Remove Menu from Role
 */

// ============================================================================
// 15. USER (ACCOUNT) INTERFACES
// ============================================================================

export interface CreateUserRequest {
	employee_id: string; // Employee ID
	email: string; // Email address
	first_name: string; // First name
	last_name: string; // Last name
	phone_number: string; // Phone number
	profile_picture_url?: string; // Profile picture URL (optional)
	role_uuid: string; // Role UUID
	store_uuid: string; // Store UUID
	last_action_by: string; // required
}

export interface UpdateUserRequest {
	employee_id: string; // Employee ID
	email: string; // Email address
	first_name: string; // First name
	last_name: string; // Last name
	phone_number: string; // Phone number
	profile_picture_url?: string; // Profile picture URL (optional)
	role_uuid: string; // Role UUID
	store_uuid: string; // Store UUID
	last_action_by: string; // required
	lock_user: boolean; // default false
}

export interface SetPasswordRequest {
	token: string;
	password: string;
	confirm_password: string;
}

export interface ResendPasswordSetupLinkRequest {
	email: string;
}

export interface ChangePasswordRequest {
	old_password: string;
	new_password: string;
	confirm_password: string;
}

export interface UserResponse {
	uuid: string;
	employee_id: string;
	email: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	profile_picture_url: string;
	role_uuid: string;
	role_name: string;
	role_code: string;
	store_uuid: string;
	store_name: string;
	store_code: string;
	lock_user?: boolean;
}

export interface UserListResponse {
	current_page: number;
	page_size: number;
	total_pages: number;
	total_records: number;
	has_next: boolean;
	has_prev: boolean;
	data: UserResponse[];
}

export interface UserDetailResponse {
	success: boolean;
	message: string;
	data: UserResponse;
}

/**
 * USER ENDPOINTS:
 * Protected by: AuthMiddleware
 * Create/Delete operations require: RequireRole("ADMIN", "SUPER_ADMIN")
 *
 * GET    /api/v1/users                      - Get All Users (with pagination)
 * GET    /api/v1/users/active               - Get All Active Users (with pagination)
 * GET    /api/v1/users/search               - Search Users
 * GET    /api/v1/users/email                - Get User by Email (query param)
 * GET    /api/v1/users/uuid/:uuid           - Get User by UUID
 * PUT    /api/v1/users/:uuid                - Update User
 * POST   /api/v1/users                      - Create User (ADMIN only)
 * DELETE /api/v1/users/:uuid                - Delete User (ADMIN only)
 * POST   /api/v1/users/password/set         - Set Password (first time)
 * POST   /api/v1/users/password/resend      - Resend Password Setup Link
 * POST   /api/v1/users/:uuid/password/change - Change Password
 */

// ============================================================================
// 16. TICKET INTERFACES
// ============================================================================

export interface TicketListItem {
	ticket_number: string;
	work_category_name: string;
	description: string;
	priority_name: string;
	requester_name: string;
	created_at: string;
	due_sla_resolution?: string;
	resolve_date?: string;
	ticket_status: string;
	assignee_display_name: string;
	store_name?: string;
	floor_area_name?: string;
}

export interface TicketListResponse {
	success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: TicketListItem[];
	};
}

export enum UploadedAtStage {
	created = 'created',
	resolved = 'resolved',
}

export enum DateFilterType {
	createdAt = 'created_at',
	dueDate = 'due_sla_resolution',
	resolvedDate = 'resolved_date',
}

export interface TicketImage {
	uuid: string;
	image_url: string;
	uploaded_at_stage: UploadedAtStage;
}

export interface TicketDetailData {
	ticket_id: number;
	uuid: string;
	ticket_number: string;
	store_id: number;
	store_name: string;
	requester_name: string;
	store_phone_number: string;
	store_address: string;
	work_category_id: number;
	work_category_name: string;
	room_area_id: number;
	room_area_name: string;
	floor_area_id: number;
	floor_area_name: string;
	ticket_status: BadgeType;
	priority_id: number;
	priority_name: BadgeType;
	assigned_to: string | null;
	assign_type: AssignType | null;
	assignee_name: string | null;
	assignee_display_name: string | null;
	due_sla_response: string;
	due_sla_resolution: string;
	description: string;
	created_by: string;
	created_at: string;
	updated_at: string;
	images: TicketImage[];
}

export interface TicketDetailResponse {
	success: boolean;
	message: string;
	data: TicketDetailData;
}

export interface TicketActivity {
	uuid: string;
	activity: string;
	category: string;
	status: BadgeType;
	remarks: string;
	completed_at: string;
	action_timestamp: string;
	action_by_uuid: string;
	action_by_name: string;
	end_date?: string;
}

export interface TicketActivityListResponse {
	success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: TicketActivity[];
	};
}

export interface TicketHistory {
	uuid: string;
	action_ticket: string;
	action_timestamp: string;
	action_by: number;
	action_by_name: string;
	remarks?: string;
	reason?: string;
	previous_assignee_id?: number;
	previous_assignee_name?: string;
}

export interface TicketHistoryListResponse {
	success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		has_next: boolean;
		has_prev: boolean;
		data: TicketHistory[];
	};
}

export interface CreateActivityRequest {
	category: 'Preparation' | 'Fixing';
	remarks: string;
}

export interface CreateActivityResponse {
	success: boolean;
	message: string;
	data: {
		uuid: string;
		activity: string;
		category: string;
		status: string;
		remarks: string;
		action_timestamp: string;
		action_by: number;
		action_by_name: string;
	};
}

export type UpdateActivityRequest = CreateActivityRequest;
export type UpdateActivityResponse = CreateActivityResponse;

export interface AssignTicketFormData {
	priority_uuid: string;
	assign_type: AssignType;
	assignee_uuid: string;
	vendor_name?: string;
	vendor_pic_name?: string;
	vendor_pic_contact?: string;
}

/**
 * TICKET ENDPOINTS:
 *
 * GET /api/v1/tickets?page=1&page_size=10 - Get All Tickets
 * GET /api/v1/admin/tickets/:id - Get Ticket Detail
 * GET /api/v1/admin/tickets/:ticket_id/activities?page=1&page_size=10 - Get Ticket Activities
 * GET /api/v1/admin/tickets/:ticket_id/histories?page=1&page_size=10 - Get Ticket Histories
 * POST /api/v1/admin/tickets/:ticket_number/activities - Create Activity
 * PUT /api/v1/admin/tickets/:ticket_number/activities/:activity_id - Update Activity
 */

// ============================================================================
// 17. NOTIFICATION INTERFACES
// ============================================================================

export type NotificationType = 'ticket_assigned' | 'transfer_rejected';

export interface NotificationItem {
	uuid: string;
	title: string;
	body: string;
	notification_type: NotificationType;
	data?: Record<string, unknown>;
	is_read: boolean;
	read_at?: string;
	created_at: string;
}

export interface NotificationListParams {
	page?: number;
	page_size?: number;
	is_read?: boolean;
	is_active?: boolean;
	type?: NotificationType;
}

export interface NotificationListResponse {
	success: boolean;
	message: string;
	data: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_records: number;
		unread_count: number;
		has_next: boolean;
		has_prev: boolean;
		data: NotificationItem[];
	};
}

export interface UnreadCountResponse {
	success: boolean;
	message: string;
	data: {
		unread_count: number;
	};
}

/**
 * NOTIFICATION ENDPOINTS:
 *
 * GET /api/v1/notifications - Get Notifications List
 *     Query params: page, page_size, is_read, type
 * GET /api/v1/notifications/unread-count - Get Unread Count
 */

// ============================================================================
// 18. HEALTH CHECK INTERFACE
// ============================================================================

export interface HealthCheckResponse {
	status: string; // "ok"
	message: string; // "Ticket Management API is running"
}

/**
 * HEALTH CHECK ENDPOINT:
 *
 * GET /health - Health Check
 */

// ============================================================================
// SUMMARY
// ============================================================================

/**
 * TOTAL ENDPOINTS: 104+
 *
 * Module Breakdown:
 * - Authentication: 4 endpoints
 * - Role: 6 endpoints
 * - Menu: 9 endpoints
 * - Location: 10 endpoints
 * - Store: 10 endpoints
 * - Work Category: 8 endpoints
 * - Floor Area: 7 endpoints
 * - Room Area: 7 endpoints
 * - Reason Pending: 7 endpoints
 * - Reason Transfer: 7 endpoints
 * - Reason Reject: 7 endpoints
 * - Ticket Priority: 10 endpoints
 * - SLA Pending: 7 endpoints
 * - Role Menu: 12 endpoints
 * - User: 11 endpoints
 * - Health Check: 1 endpoint
 *
 * Framework: Gin (Golang)
 * Architecture: Clean Architecture (Handler -> Service -> Repository)
 *
 * Router Files:
 * - internal/routes/auth_routes.go
 * - internal/routes/role_router.go
 * - internal/routes/menu_router.go
 * - internal/routes/location_router.go
 * - internal/routes/store_router.go
 * - internal/routes/work_category_router.go
 * - internal/routes/floor_area_router.go
 * - internal/routes/room_area_router.go
 * - internal/routes/reason_pending_router.go
 * - internal/routes/reason_transfer_router.go
 * - internal/routes/reason_reject_router.go
 * - internal/routes/sla_ticket_router.go (Ticket Priority)
 * - internal/routes/sla_pending_router.go
 * - internal/routes/role_menu_router.go
 * - internal/routes/user_router.go
 *
 * Main Entry Point: cmd/api/main.go
 *
 * Authentication & Authorization:
 * - JWT-based authentication (access_token + refresh_token)
 * - Role-based access control (RBAC)
 * - Middleware: AuthMiddleware, RequireRole
 */

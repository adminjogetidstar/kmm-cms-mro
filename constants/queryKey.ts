/**
 * Query Keys for TanStack Query
 * Centralized query key management
 */

export const QUERY_KEYS = {
	// Auth
	AUTH: ['auth'] as const,

	// Stores
	STORES: ['stores'] as const,
	get STORES_LIST() {
		return [...this.STORES, 'list'] as const;
	},
	get STORES_DETAIL() {
		return [...this.STORES, 'detail'] as const;
	},

	// Locations
	LOCATIONS: ['locations'] as const,
	get LOCATIONS_LIST() {
		return [...this.LOCATIONS, 'list'] as const;
	},
	get LOCATIONS_DETAIL() {
		return [...this.LOCATIONS, 'detail'] as const;
	},
	COUNTRIES: ['countries'] as const,
	SUBLOCATIONS: ['sublocations'] as const,
	LOCATION_HIERARCHIES: ['hierarchies'] as const,

	// Roles
	ROLES: ['roles'] as const,
	get ROLES_LIST() {
		return [...this.ROLES, 'list'] as const;
	},
	get ROLES_DETAIL() {
		return [...this.ROLES, 'detail'] as const;
	},

	// Menus
	MENUS: ['menus'] as const,
	get MENUS_BY_ROLE() {
		return [...this.MENUS, 'by-role'] as const;
	},
	ACTIVE_MENUS: ['active_menus'] as const,

	// Users (Accounts)
	USERS: ['users'] as const,
	get USERS_LIST() {
		return [...this.USERS, 'list'] as const;
	},
	get USERS_DETAIL() {
		return [...this.USERS, 'detail'] as const;
	},

	// Work Categories
	WORK_CATEGORIES: ['work-categories'] as const,

	// Floor Areas
	FLOOR_AREAS: ['floor-areas'] as const,

	// Room Areas
	ROOM_AREAS: ['room-areas'] as const,

	// Reason Pendings
	REASON_PENDINGS: ['reason-pendings'] as const,

	// Reason Transfers
	REASON_TRANSFERS: ['reason-transfers'] as const,

	// Reason Rejects
	REASON_REJECTS: ['reason-rejects'] as const,

	// Ticket Priorities
	TICKET_PRIORITIES: ['ticket-priorities'] as const,

	// Tickets
	TICKETS: ['tickets'] as const,
	get TICKET_STATUS_COUNT() {
		return [...this.TICKETS, 'status-count'] as const;
	},
	get TICKET_DETAIL() {
		return [...this.TICKETS, 'detail'] as const;
	},
	get TICKET_ACTIVITIES() {
		return [...this.TICKETS, 'activities'] as const;
	},
	get TICKET_HISTORIES() {
		return [...this.TICKETS, 'histories'] as const;
	},

	// Assignees
	ASSIGNEES: ['assignees'] as const,

	// Dashboard
	DASHBOARD: ['dashboard'] as const,
	get DASHBOARD_TICKET_STATUS_PRIORITY() {
		return [...this.DASHBOARD, 'ticket-status-priority'] as const;
	},
	get DASHBOARD_WORK_CATEGORY_CONTRIBUTION() {
		return [...this.DASHBOARD, 'work-category-contribution'] as const;
	},
	get DASHBOARD_TOP_STORES() {
		return [...this.DASHBOARD, 'top-stores'] as const;
	},
	get DASHBOARD_FLOOR_AREA_DISTRIBUTION() {
		return [...this.DASHBOARD, 'floor-area-distribution'] as const;
	},
	get DASHBOARD_STORE_WORK_CATEGORY_DISTRIBUTION() {
		return [...this.DASHBOARD, 'store-work-category-distribution'] as const;
	},
	get DASHBOARD_TREND_TOTAL_REQUEST() {
		return [...this.DASHBOARD, 'trend-total-request'] as const;
	},
	get DASHBOARD_AVERAGE_MAINTENANCE_DURATION() {
		return [...this.DASHBOARD, 'average-maintenance-duration'] as const;
	},
	get DASHBOARD_PREPARATION_SLA_AVERAGE() {
		return [...this.DASHBOARD, 'preparation-sla-average'] as const;
	},
	get DASHBOARD_FIXING_SLA_AVERAGE() {
		return [...this.DASHBOARD, 'fixing-sla-average'] as const;
	},
	get DASHBOARD_SLA_RESOLUTION_STATS() {
		return [...this.DASHBOARD, 'sla-resolution-stats'] as const;
	},
	get DASHBOARD_SLA_DISTRIBUTION() {
		return [...this.DASHBOARD, 'sla-distribution'] as const;
	},

	// Notifications
	NOTIFICATIONS: ['notifications'] as const,
	get NOTIFICATIONS_LIST() {
		return [...this.NOTIFICATIONS, 'list'] as const;
	},
	get NOTIFICATIONS_UNREAD_COUNT() {
		return [...this.NOTIFICATIONS, 'unread-count'] as const;
	},
};

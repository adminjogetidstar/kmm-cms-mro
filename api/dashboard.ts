import apiRequest from './helper';

// ============================================================================
// DASHBOARD FILTER PARAMS
// ============================================================================

export interface DashboardFilterParams {
	priority_uuid?: string[];
	store_uuid?: string[];
	requester_uuid?: string[];
	maintenance_type_uuid?: string[];
	start_date?: string;
	end_date?: string;
	date_filter_type?: 'due_date' | 'created_at';
	ticket_status?: string[];
}

export interface StoreWorkCategoryDistributionParams extends DashboardFilterParams {
	page?: number;
	limit?: number;
}

export interface TopStoresParams extends DashboardFilterParams {
	limit?: number;
}

// ============================================================================
// DASHBOARD API RESPONSE TYPES (Source of Truth)
// ============================================================================

export interface TicketStatusPriorityApiResponse {
	success: boolean;
	message: string;
	data: {
		data: {
			status: string;
			total_request: number;
			priorities: {
				label: string;
				value: number;
			}[];
		}[];
	};
}

export interface WorkCategoryContributionApiResponse {
	success: boolean;
	message: string;
	data: {
		total: number;
		data: {
			work_category_name: string;
			count: number;
			percentage: number;
		}[];
	};
}

export interface TopStoresApiResponse {
	success: boolean;
	message: string;
	data: {
		data: {
			store_name: string;
			total_request: number;
			priorities: {
				label: string;
				value: number;
			}[];
		}[];
	};
}

export interface FloorAreaDistributionApiResponse {
	success: boolean;
	message: string;
	data: {
		total: number;
		data: {
			floor_area_name: string;
			count: number;
			percentage: number;
		}[];
	};
}

export interface StoreWorkCategoryDistributionApiResponse {
	success: boolean;
	message: string;
	data: {
		data: {
			store_name: string;
			total_request: number;
			work_categories: {
				label: string;
				value: number;
			}[];
		}[];
		pagination: {
			page: number;
			limit: number;
			total_items: number;
			total_pages: number;
		};
	};
}

export interface TrendTotalRequestApiResponse {
	success: boolean;
	message: string;
	data: {
		data: {
			date: string;
			total_request: number;
			priorities: {
				label: string;
				value: number;
			}[];
		}[];
	};
}

export interface AverageMaintenanceDurationApiResponse {
	success: boolean;
	message: string;
	data: {
		data: {
			work_category_name: string;
			priorities: {
				label: string;
				average_days: number;
				ticket_count: number;
			}[];
		}[];
	};
}

export interface PreparationSLAAverageApiResponse {
	success: boolean;
	message: string;
	data: {
		total_tickets: number;
		data: {
			label: string;
			average_hours: number;
			ticket_count: number;
		}[];
	};
}

export interface FixingSLAAverageApiResponse {
	success: boolean;
	message: string;
	data: {
		total_tickets: number;
		data: {
			label: string;
			average_hours: number;
			ticket_count: number;
		}[];
	};
}

export interface SLADistributionApiResponse {
	success: boolean;
	message: string;
	data: {
		total: number;
		data: {
			status: string;
			count: number;
		}[];
	};
}

export interface SLAResolutionStatsApiResponse {
	success: boolean;
	message: string;
	data: {
		data: {
			priority_name: string;
			sla_target: number;
			lowest_days: number;
			highest_days: number;
			average_days: number;
			total_tickets: number;
		}[];
	};
}

// ============================================================================
// HELPER FUNCTION
// ============================================================================

const buildQueryString = <T extends object>(params: T): string => {
	const queryParts: string[] = [];

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			queryParts.push(`${key}=${encodeURIComponent(String(value))}`);
		}
	});

	return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
};

// ============================================================================
// DASHBOARD API SERVICE
// ============================================================================

export const dashboardApi = {
	getTicketStatusPriority: async (
		params?: DashboardFilterParams
	): Promise<TicketStatusPriorityApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<TicketStatusPriorityApiResponse>(
			`/dashboard/ticket-status-priority${queryString}`
		);
	},

	getWorkCategoryContribution: async (
		params?: DashboardFilterParams
	): Promise<WorkCategoryContributionApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<WorkCategoryContributionApiResponse>(
			`/dashboard/work-category-contribution${queryString}`
		);
	},

	getTopStores: async (
		params?: TopStoresParams
	): Promise<TopStoresApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<TopStoresApiResponse>(
			`/dashboard/top-stores${queryString}`
		);
	},

	getFloorAreaDistribution: async (
		params?: DashboardFilterParams
	): Promise<FloorAreaDistributionApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<FloorAreaDistributionApiResponse>(
			`/dashboard/floor-area-distribution${queryString}`
		);
	},

	getStoreWorkCategoryDistribution: async (
		params?: StoreWorkCategoryDistributionParams
	): Promise<StoreWorkCategoryDistributionApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<StoreWorkCategoryDistributionApiResponse>(
			`/dashboard/store-work-category-distribution${queryString}`
		);
	},

	getTrendTotalRequest: async (
		params?: DashboardFilterParams
	): Promise<TrendTotalRequestApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<TrendTotalRequestApiResponse>(
			`/dashboard/trend-total-request${queryString}`
		);
	},

	getAverageMaintenanceDuration: async (
		params?: DashboardFilterParams
	): Promise<AverageMaintenanceDurationApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<AverageMaintenanceDurationApiResponse>(
			`/dashboard/average-maintenance-duration${queryString}`
		);
	},

	getPreparationSLAAverage: async (
		params?: DashboardFilterParams
	): Promise<PreparationSLAAverageApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<PreparationSLAAverageApiResponse>(
			`/dashboard/preparation-sla-average${queryString}`
		);
	},

	getFixingSLAAverage: async (
		params?: DashboardFilterParams
	): Promise<FixingSLAAverageApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<FixingSLAAverageApiResponse>(
			`/dashboard/fixing-sla-average${queryString}`
		);
	},

	getSLAResolutionStats: async (
		params?: DashboardFilterParams
	): Promise<SLAResolutionStatsApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<SLAResolutionStatsApiResponse>(
			`/dashboard/sla-resolution-stats${queryString}`
		);
	},

	getSLADistribution: async (
		params?: DashboardFilterParams
	): Promise<SLADistributionApiResponse> => {
		const queryString = buildQueryString(params || {});
		return apiRequest<SLADistributionApiResponse>(
			`/dashboard/sla-distribution${queryString}`
		);
	},
};

import { useQuery } from '@tanstack/react-query';
import {
	dashboardApi,
	type DashboardFilterParams,
	type TopStoresParams,
	type StoreWorkCategoryDistributionParams,
	type TicketStatusPriorityApiResponse,
	type WorkCategoryContributionApiResponse,
	type TopStoresApiResponse,
	type FloorAreaDistributionApiResponse,
	type StoreWorkCategoryDistributionApiResponse,
	type TrendTotalRequestApiResponse,
	type AverageMaintenanceDurationApiResponse,
	type PreparationSLAAverageApiResponse,
	type FixingSLAAverageApiResponse,
	type SLAResolutionStatsApiResponse,
} from '../api/dashboard';
import { QUERY_KEYS } from '../constants/queryKey';

// All hooks return API response directly - no transformation
// API is source of truth, components adapt to API structure

export const useTicketStatusPriority = (params?: DashboardFilterParams) => {
	return useQuery<TicketStatusPriorityApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_TICKET_STATUS_PRIORITY, params],
		queryFn: () => dashboardApi.getTicketStatusPriority(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useWorkCategoryContribution = (params?: DashboardFilterParams) => {
	return useQuery<WorkCategoryContributionApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_WORK_CATEGORY_CONTRIBUTION, params],
		queryFn: () => dashboardApi.getWorkCategoryContribution(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useTopStores = (params?: TopStoresParams) => {
	return useQuery<TopStoresApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_TOP_STORES, params],
		queryFn: () => dashboardApi.getTopStores(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useFloorAreaDistribution = (params?: DashboardFilterParams) => {
	return useQuery<FloorAreaDistributionApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_FLOOR_AREA_DISTRIBUTION, params],
		queryFn: () => dashboardApi.getFloorAreaDistribution(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useStoreWorkCategoryDistribution = (
	params?: StoreWorkCategoryDistributionParams
) => {
	return useQuery<StoreWorkCategoryDistributionApiResponse>({
		queryKey: [
			...QUERY_KEYS.DASHBOARD_STORE_WORK_CATEGORY_DISTRIBUTION,
			params,
		],
		queryFn: () => dashboardApi.getStoreWorkCategoryDistribution(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useTrendTotalRequest = (params?: DashboardFilterParams) => {
	return useQuery<TrendTotalRequestApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_TREND_TOTAL_REQUEST, params],
		queryFn: () => dashboardApi.getTrendTotalRequest(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useAverageMaintenanceDuration = (
	params?: DashboardFilterParams
) => {
	return useQuery<AverageMaintenanceDurationApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_AVERAGE_MAINTENANCE_DURATION, params],
		queryFn: () => dashboardApi.getAverageMaintenanceDuration(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const usePreparationSLAAverage = (params?: DashboardFilterParams) => {
	return useQuery<PreparationSLAAverageApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_PREPARATION_SLA_AVERAGE, params],
		queryFn: () => dashboardApi.getPreparationSLAAverage(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useFixingSLAAverage = (params?: DashboardFilterParams) => {
	return useQuery<FixingSLAAverageApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_FIXING_SLA_AVERAGE, params],
		queryFn: () => dashboardApi.getFixingSLAAverage(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useSLAResolutionStats = (params?: DashboardFilterParams) => {
	return useQuery<SLAResolutionStatsApiResponse>({
		queryKey: [...QUERY_KEYS.DASHBOARD_SLA_RESOLUTION_STATS, params],
		queryFn: () => dashboardApi.getSLAResolutionStats(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useSLADistribution = (params?: DashboardFilterParams) => {
	return useQuery({
		queryKey: [...QUERY_KEYS.DASHBOARD_SLA_DISTRIBUTION, params],
		queryFn: async () => {
			const resp = await dashboardApi.getSLADistribution(params);
			return resp.data.data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

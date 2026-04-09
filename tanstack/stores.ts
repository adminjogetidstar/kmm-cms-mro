/**
 * Tanstack Query hooks for Store API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeApi } from '../api';
import type { StoreListResponse, StoreResponse } from '../types/backend';
import { QUERY_KEYS } from '../constants/queryKey';

/**
 * Hook to get all active stores
 * GET /api/v1/stores/active
 */
export const useGetStores = (
	page: number = 1,
	pageSize: number = 10,
	search?: string,
	sortBy?: string,
	sortOrder?: 'ASC' | 'DESC'
) => {
	return useQuery<StoreListResponse>({
		queryKey: [
			...QUERY_KEYS.STORES_LIST,
			page,
			pageSize,
			search,
			sortBy,
			sortOrder,
		],
		queryFn: () =>
			storeApi.getAllStores(page, pageSize, search, sortBy, sortOrder),
		staleTime: 300000, // 5 minutes
	});
};

/**
 * Hook to get store by UUID
 * GET /api/v1/stores/:uuid
 */
export const useGetStoreByUUID = (uuid: string | undefined) => {
	return useQuery<{ Success: boolean; message: string; data: StoreResponse }>({
		queryKey: [...QUERY_KEYS.STORES_DETAIL, uuid],
		queryFn: () => storeApi.getStoreByUUID(uuid!),
		enabled: !!uuid,
	});
};

/**
 * Hook to create a new store
 * POST /api/v1/stores
 */
export const useCreateStore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: any) => storeApi.createStore(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
		},
	});
};

/**
 * Hook to update a store
 * PUT /api/v1/stores/:uuid
 */
export const useUpdateStore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ uuid, data }: { uuid: string; data: any }) =>
			storeApi.updateStore(uuid, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
		},
	});
};

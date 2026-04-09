/**
 * Tanstack Query hooks for Menu API
 */

import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../api/menus';
import type { ActiveMenusResponse } from '../types/backend';
import { QUERY_KEYS } from '../constants/queryKey';

/**
 * Hook to fetch active menus
 * GET /api/v1/menus/active
 */
export const useGetActiveMenus = () => {
	return useQuery<ActiveMenusResponse>({
		queryKey: [QUERY_KEYS.MENUS, QUERY_KEYS.ACTIVE_MENUS],
		queryFn: () => menuApi.getActiveMenus(),
	});
};

/**
 * Hook to fetch all menus
 * GET /api/v1/menus
 */
export const useGetAllMenus = () => {
	return useQuery<ActiveMenusResponse>({
		queryKey: [QUERY_KEYS.MENUS],
		queryFn: () => menuApi.getAllMenus(),
	});
};

/**
 * Tanstack Query hooks for Location API
 */

import { useQuery } from '@tanstack/react-query';
import { locationApi } from '../api';
import { queryClient } from '.';
import { QUERY_KEYS } from '../constants/queryKey';
import { LocationListResponse, LocationResponse } from '@shared/types/backend';

export function invalidateLocationQueries() {
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCATIONS] });
}

/**
 * Hook to get all active locations
 * GET /api/v1/locations/active
 */
export const useGetLocations = (
	page: number = 1,
	pageSize: number = 50,
	search?: string,
	sortBy?: string,
	sortOrder?: 'ASC' | 'DESC'
) => {
	return useQuery<LocationListResponse>({
		queryKey: [
			...QUERY_KEYS.LOCATIONS_LIST,
			page,
			pageSize,
			search,
			sortBy,
			sortOrder,
		],
		queryFn: () =>
			locationApi.getAllLocations(page, pageSize, search, sortBy, sortOrder),
		staleTime: 300000, // 5 minutes
	});
};

export const useGetCountries = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.LOCATIONS, QUERY_KEYS.COUNTRIES],
		queryFn: async () => (await locationApi.getTopLevelLocations()).data,
		staleTime: 300000, // 5 minutes
	});
};

export const useSubLocation = (parentUuid?: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.LOCATIONS, QUERY_KEYS.SUBLOCATIONS, parentUuid],
		queryFn: async () => (await locationApi.getSubLocations(parentUuid!)).data,
		staleTime: 300000, // 5 minutes
		enabled: !!parentUuid,
	});
};

export const useLocationHierarchy = (uuid?: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.LOCATIONS, QUERY_KEYS.LOCATION_HIERARCHIES, uuid],
		queryFn: async () => (await locationApi.getLocationHierarchy(uuid!)).data,
		staleTime: 300000, // 5 minutes
		enabled: !!uuid,
	});
};

/**
 * Hook to get location by UUID
 * GET /api/v1/locations/:uuid
 */
export const useGetLocationByUUID = (uuid: string | undefined) => {
	return useQuery<{
		Success: boolean;
		message: string;
		data: LocationResponse;
	}>({
		queryKey: [...QUERY_KEYS.LOCATIONS_DETAIL, uuid],
		queryFn: () => locationApi.getLocationById(uuid!),
		enabled: !!uuid,
	});
};

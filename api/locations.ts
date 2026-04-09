import {
	LocationListResponse,
	LocationResponse,
	LocationType,
} from '@shared/types/backend';
import apiRequest from './helper';

export type Location = {
	uuid: string;
	location_name: string;
	type: string;
};

export interface SubLocationResponse {
	Success: boolean;
	message: string;
	data: {
		total: number;
		data: Location[];
	};
}

export interface LocationHierarchyResponse {
	Success: boolean;
	message: string;
	data: {
		location: {
			uuid: string;
			location_name: string;
			type: LocationType;
		};
		parents: Array<{
			uuid: string;
			location_name: string;
			type: LocationType;
		}>;
	};
}

interface CreateLocationRequest {
	location_name: string;
	type: LocationType;
	parent_uuid: string | null;
	last_action_by: string;
}

type ParentLocation = {
	Success: boolean;
	message: string;
	data: { total: number; data: Location[] };
};

interface UpdateLocationRequest {
	location_name: string;
	type: LocationType;
	parent_uuid: string | null;
	last_action_by: string;
}

export const locationApi = {
	/**
	 * Get All Locations (Active)
	 * GET /api/v1/locations/active?page=1&page_size=50&sort=location_name&order=ASC&location_name=search
	 */
	getAllLocations: async (
		page: number = 1,
		pageSize: number = 50,
		search?: string,
		sortBy?: string,
		sortOrder?: 'ASC' | 'DESC'
	): Promise<LocationListResponse> => {
		let url = `/locations/active?page=${page}&page_size=${pageSize}`;
		if (sortBy) {
			url += `&sort=${sortBy}&order=${sortOrder || ''}`;
		}
		if (search && search.trim()) {
			const searchTerm = encodeURIComponent(search.trim());
			url += `&location_name=${searchTerm}`;
		}
		return apiRequest<LocationListResponse>(url);
	},

	/**
	 * Get Location by UUID
	 * GET /api/v1/locations/:uuid
	 */
	getLocationById: async (
		uuid: string
	): Promise<{ Success: boolean; message: string; data: LocationResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: LocationResponse;
		}>(`/locations/${uuid}`);
	},

	/**
	 * Get Location Hierarchy by UUID
	 * GET /api/v1/locations/:uuid/hierarchy
	 */
	getLocationHierarchy: async (uuid: string) => {
		return apiRequest<LocationHierarchyResponse>(
			`/locations/${uuid}/hierarchy`
		);
	},

	/**
	 * Get Sub-locations by Parent UUID
	 * GET /api/v1/locations/sublocations/:parent_uuid
	 */
	getSubLocations: async (parentUuid: string): Promise<SubLocationResponse> => {
		return apiRequest<SubLocationResponse>(
			`/locations/sublocations/${parentUuid}`
		);
	},

	/**
	 * Create Location
	 * POST /api/v1/locations
	 */
	createLocation: async (
		data: CreateLocationRequest
	): Promise<{ Success: boolean; message: string; data: LocationResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: LocationResponse;
		}>('/locations', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update Location
	 * PUT /api/v1/locations/:uuid
	 */
	updateLocation: async (
		uuid: string,
		data: UpdateLocationRequest
	): Promise<{ Success: boolean; message: string; data: LocationResponse }> => {
		return apiRequest<{
			Success: boolean;
			message: string;
			data: LocationResponse;
		}>(`/locations/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Delete Location
	 * DELETE /api/v1/locations/:uuid
	 */
	deleteLocation: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<{ Success: boolean; message: string }> => {
		return apiRequest<{ Success: boolean; message: string }>(
			`/locations/${uuid}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					last_action_by: lastActionBy,
				}),
			}
		);
	},
	getTopLevelLocations: async (): Promise<ParentLocation> => {
		return apiRequest<ParentLocation>('/locations/parents');
	},
};

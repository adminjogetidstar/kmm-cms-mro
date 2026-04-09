import apiRequest from './helper';
import type { FloorAreaListResponse } from '../types/backend';

export const floorAreaApi = {
	/**
	 * Get All Active Floor Areas
	 * GET /api/v1/floor-areas/active
	 */
	getAllActiveFloorAreas: async (): Promise<FloorAreaListResponse> => {
		return apiRequest<FloorAreaListResponse>(
			'/floor-areas/active?page=1&page_size=100'
		);
	},
};
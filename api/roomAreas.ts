import apiRequest from './helper';
import type { RoomAreaListResponse } from '../types/backend';

export const roomAreaApi = {
	/**
	 * Get All Active Room Areas
	 * GET /api/v1/room-areas/active
	 */
	getAllActiveRoomAreas: async (): Promise<RoomAreaListResponse> => {
		return apiRequest<RoomAreaListResponse>(
			'/room-areas/active?page=1&page_size=100'
		);
	},
};
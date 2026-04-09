import apiRequest from './helper';
import type { WorkCategoryListResponse } from '../types/backend';

export const workCategoryApi = {
	/**
	 * Get All Active Work Categories
	 * GET /api/v1/work-categories/active
	 */
	getAllActiveWorkCategories: async (): Promise<WorkCategoryListResponse> => {
		return apiRequest<WorkCategoryListResponse>(
			'/work-categories/active?page=1&page_size=100'
		);
	},
};
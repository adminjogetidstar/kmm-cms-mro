import { useQuery } from '@tanstack/react-query';
import { workCategoryApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';

interface UseWorkCategoriesOptions {
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
}

export const useWorkCategories = (options?: UseWorkCategoriesOptions) => {
	const { sortBy = 'category_name', sortOrder = 'ASC' } = options || {};

	return useQuery({
		queryKey: [QUERY_KEYS.WORK_CATEGORIES, sortBy, sortOrder],
		queryFn: async () =>
			(
				await workCategoryApi.getAllWorkCategories(
					1,
					100,
					undefined,
					sortBy,
					sortOrder
				)
			).data,
		staleTime: 300000, // 5 minutes
	});
};
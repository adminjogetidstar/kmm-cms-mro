import { useQuery } from '@tanstack/react-query';
import { floorAreaApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';

interface UseFloorAreasOptions {
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
}

export const useFloorAreas = (options?: UseFloorAreasOptions) => {
	const { sortBy = 'floor_area_name', sortOrder = 'ASC' } = options || {};

	return useQuery({
		queryKey: [QUERY_KEYS.FLOOR_AREAS, sortBy, sortOrder],
		queryFn: async () =>
			(
				await floorAreaApi.getAllFloorAreas(
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
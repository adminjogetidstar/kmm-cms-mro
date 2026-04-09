import { useQuery } from '@tanstack/react-query';
import { roomAreaApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';

interface UseRoomAreasOptions {
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
}

export const useRoomAreas = (options?: UseRoomAreasOptions) => {
	const { sortBy = 'room_area_name', sortOrder = 'ASC' } = options || {};

	return useQuery({
		queryKey: [QUERY_KEYS.ROOM_AREAS, sortBy, sortOrder],
		queryFn: async () =>
			(
				await roomAreaApi.getAllRoomAreas(
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
import { useQuery } from '@tanstack/react-query';
import { reasonPendingApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';

export const useGetReasonPendings = (
	page: number = 1,
	pageSize: number = 10,
	search?: string,
	sortBy?: string,
	sortOrder?: 'ASC' | 'DESC'
) => {
	return useQuery({
		queryKey: [...QUERY_KEYS.REASON_PENDINGS, page, pageSize, search, sortBy, sortOrder],
		queryFn: () => reasonPendingApi.getAllReasonPendings(page, pageSize, search, sortBy, sortOrder),
	});
};

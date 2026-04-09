import { useQuery } from '@tanstack/react-query';
import { reasonRejectApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';

export const useGetReasonRejects = (
	page: number = 1,
	pageSize: number = 10,
	search?: string,
	sortBy?: string,
	sortOrder?: 'ASC' | 'DESC'
) => {
	return useQuery({
		queryKey: [...QUERY_KEYS.REASON_REJECTS, page, pageSize, search, sortBy, sortOrder],
		queryFn: () => reasonRejectApi.getAllReasonRejects(page, pageSize, search, sortBy, sortOrder),
	});
};

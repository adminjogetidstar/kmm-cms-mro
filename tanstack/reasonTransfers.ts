import { useQuery } from '@tanstack/react-query';
import { reasonTransferApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';

export const useGetReasonTransfers = (
	page: number = 1,
	pageSize: number = 10,
	search?: string,
	sortBy?: string,
	sortOrder?: 'ASC' | 'DESC'
) => {
	return useQuery({
		queryKey: [
			...QUERY_KEYS.REASON_TRANSFERS,
			page,
			pageSize,
			search,
			sortBy,
			sortOrder,
		],
		queryFn: () =>
			reasonTransferApi.getAllReasonTransfers(
				page,
				pageSize,
				search,
				sortBy,
				sortOrder
			),
	});
};

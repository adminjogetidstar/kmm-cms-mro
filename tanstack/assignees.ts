import { useQuery } from '@tanstack/react-query';
import { assigneeApi } from '../api';
import { QUERY_KEYS } from '../constants/queryKey';
import { AssignType } from '../types/backend';

export const useGetAssignees = (type: AssignType) => {
	const query = useQuery({
		queryKey: [...QUERY_KEYS.ASSIGNEES, type],
		queryFn: () => assigneeApi.getAssignees(type),
		enabled: type !== undefined,
	});

	const mappedData =
		query.data?.data?.map((e) => ({
			label: e.name,
			value: e.uuid,
		})) || [];

	return { ...query, mappedData };
};

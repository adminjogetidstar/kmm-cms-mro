import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

export * from './roles';
export * from './menus';
export * from './locations';
export * from './stores';
export * from './users';
export * from './tickets';
export * from './reasonRejects';
export * from './reasonPendings';
export * from './reasonTransfers';
export * from './assignees';
export * from './ticketPriorities';
export * from './workCategories';
export * from './floorAreas';
export * from './roomAreas';
export * from './profile';
export * from './dashboard';
export * from './notifications';

import type { BadgeType } from '@shared/components';

const BASE_TICKET_STATUS = {
	isOpen: false,
	isAssigned: false,
	isInProgress: false,
	isPending: false,
	isResolved: false,
	isRequestToTransfer: false,
	isTransferred: false,
	isRejected: false,
	isClosed: false,
	isBreach: false,
};


const BASE_PRIORITY = {
	isHigh: false,
	isMedium: false,
	isLow: false,
};

export const useStatus = (ticketStatus?: BadgeType, priority?: BadgeType) => {
	const statusKey = ticketStatus?.toLowerCase();
	const priorityKey = priority?.toLowerCase();

	const getTicketStatus = () => {
		switch (statusKey) {
			case 'open':
				return { ...BASE_TICKET_STATUS, isOpen: true };
			case 'assigned':
				return { ...BASE_TICKET_STATUS, isAssigned: true };
			case 'inprogress':
			case 'in progress':
				return { ...BASE_TICKET_STATUS, isInProgress: true };
			case 'pending':
				return { ...BASE_TICKET_STATUS, isPending: true };
			case 'resolved':
			case 'completed':
				return { ...BASE_TICKET_STATUS, isResolved: true };
			case 'request to transfer':
			case 'request_to_transfer':
				return { ...BASE_TICKET_STATUS, isRequestToTransfer: true };
			case 'transferred':
				return { ...BASE_TICKET_STATUS, isTransferred: true };
			case 'rejected':
			case 'reject':
				return { ...BASE_TICKET_STATUS, isRejected: true };
			case 'closed':
				return { ...BASE_TICKET_STATUS, isClosed: true };
			case 'breach':
				return { ...BASE_TICKET_STATUS, isBreach: true };
			default:
				return BASE_TICKET_STATUS;
		}
	};

	const getPriority = () => {
		switch (priorityKey) {
			case 'high':
				return { ...BASE_PRIORITY, isHigh: true };
			case 'medium':
				return { ...BASE_PRIORITY, isMedium: true };
			case 'low':
				return { ...BASE_PRIORITY, isLow: true };
			default:
				return BASE_PRIORITY;
		}
	};

	return { ...getTicketStatus(), ...getPriority() };
};

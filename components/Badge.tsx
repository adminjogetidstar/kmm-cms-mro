import React from 'react';
import { cn } from '../utils';
import type { Priority, TicketStatus } from '@shared/types/backend';

type AccountStatus = 'active' | 'inactive' | 'suspended';
export type BadgeType = AccountStatus | TicketStatus | AccountStatus | Priority;

interface BadgeProps {
	status?: BadgeType;
	className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
	const statusKey = status?.toLowerCase();

	const getStatusClass = () => {
		switch (statusKey) {
			// Ticket statuses
			case 'open':
				return 'bg-red-500 text-white';
			case 'assigned':
				return 'bg-blue-500 text-white';
			case 'inprogress':
			case 'in progress':
				return 'bg-yellow-500 text-white';
			case 'pending':
				return 'bg-orange-500 text-white';
			case 'resolved':
			case 'completed':
				return 'bg-green-600 text-white';
			case 'request to transfer':
			case 'request_to_transfer':
				return 'bg-red-600 text-white';
			case 'transferred':
				return 'bg-teal-600 text-white';
			case 'rejected':
			case 'reject':
				return 'bg-gray-600 text-white';
			case 'closed':
				return 'bg-green-50 text-green-600';
			case 'breach':
				return 'bg-red-500 text-white';
			// Priority
			case 'high':
				return 'bg-red-500 text-white';
			case 'medium':
				return 'bg-yellow-500 text-white';
			case 'low':
				return 'bg-green-600 text-white';
			// Account statuses
			case 'active':
				return 'bg-green-50 text-green-600';
			case 'inactive':
				return 'bg-gray-50 text-gray-600';
			case 'suspended':
				return 'bg-red-50 text-red-600';
			default:
				return '';
		}
	};

	const getDisplayText = () => {
		if (statusKey === 'breach') {
			return 'Breach';
		}
		return status?.split(/\s/).join(' ').ucwords() || '-';
	};

	return (
		<span
			className={cn(
				'inline-block px-3 py-1 text-xs font-medium rounded-full',
				getStatusClass(),
				className
			)}
		>
			{getDisplayText()}
		</span>
	);
};

export default Badge;

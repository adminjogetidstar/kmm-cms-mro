import useTranslation from '@/hooks/useTranslation';
import { Button } from '@shared/components/ui';
import { cn } from '@shared/utils';
import { type ReactNode } from 'react';

type Actions = Partial<
	Record<
		| 'onAcknowledge'
		| 'onResolve'
		| 'onTransfer'
		| 'onEscalate'
		| 'onReject'
		| 'onRejectTransfer'
		| 'onPending'
		| 'onResume'
		| 'onAssign'
		| 'onReAssign',
		NoopVoid | false
	>
>;
export interface TicketActionButtonsProps {
	actions?: Actions;
	containerClass?: string;
	className?: string;
	renderButton?: (action: {
		key: string;
		label: string;
		color: string;
		onClick: () => void;
	}) => ReactNode;
}

const TicketActionButtons = ({
	actions = {},
	containerClass,
	className,
	renderButton,
}: TicketActionButtonsProps) => {
	const { t } = useTranslation();

	const actionConfigs = [
		{
			key: 'acknowledge',
			handler: actions.onAcknowledge,
			label: t('ticketDetail.acknowledgeButton'),
			color: 'bg-[#00BFA6] hover:bg-[#00A693]',
		},
		{
			key: 'resolve',
			handler: actions.onResolve,
			label: t('ticketDetail.resolveButton'),
			color: 'bg-[#00BFA6] hover:bg-[#00A693]',
		},
		{
			key: 'transfer',
			handler: actions.onTransfer,
			label: t('ticketDetail.transferButton'),
			color: 'bg-[#FFA726] hover:bg-[#FF9800]',
		},
		{
			key: 'pending',
			handler: actions.onPending,
			label: t('ticketDetail.pendingButton'),
			color: 'bg-[#EF5350] hover:bg-[#E53935]',
		},
		{
			key: 'resume',
			handler: actions.onResume,
			label: t('ticketDetail.resumeButton'),
			color: 'bg-[#00BFA6] hover:bg-[#00A693]',
		},
		{
			key: 'escalate',
			handler: actions.onEscalate,
			label: t('ticketDetail.escalateButton'),
			color: 'bg-yellow-500 hover:bg-yellow-600',
		},
		{
			key: 'reject',
			handler: actions.onReject,
			label: t('ticketDetail.rejectButton'),
			color: 'bg-red-600 hover:bg-red-700',
		},
		{
			key: 'rejectTransfer',
			handler: actions.onRejectTransfer,
			label: t('ticketDetail.rejectTransferButton'),
			color: 'bg-red-600 hover:bg-red-700',
		},
		{
			key: 'assign',
			handler: actions.onAssign,
			label: t('ticketDetail.assignButton'),
			color: 'bg-teal-500 hover:bg-teal-600',
		},
		{
			key: 'reAssign',
			handler: actions.onReAssign,
			label: t('ticketDetail.reAssignButton'),
			color: 'bg-teal-600 hover:bg-teal-700',
		},
	];

	const availableActions = actionConfigs.filter((config) => config.handler);

	if (availableActions.length === 0) return null;

	return (
		<div
			className={cn('flex justify-end gap-2 mb-4 flex-wrap', containerClass)}
		>
			{availableActions.map((config) => {
				const onClick = config.handler || noopVoid;

				if (renderButton)
					return renderButton({
						key: config.key,
						label: config.label,
						color: config.color,
						onClick,
					});

				return (
					<Button
						key={config.key}
						onClick={onClick}
						className={cn(
							config.color,
							'text-white px-4 py-2 rounded',
							className
						)}
					>
						{config.label}
					</Button>
				);
			})}
		</div>
	);
};

export default TicketActionButtons;

import { X } from '@phosphor-icons/react';
import { type UseBoolReturn } from '@shared/hooks/useBool';
import { cn } from '@shared/utils';
import { type ReactNode, useEffect } from 'react';

interface ModalProps extends Pick<UseBoolReturn, 'value' | 'setFalse'> {
	children: ReactNode;
	title?: string;
	showCloseButton?: boolean;
	closeOnBackdrop?: boolean;
	className?: string;
}

export function Modal({
	value,
	setFalse,
	children,
	title,
	showCloseButton = true,
	closeOnBackdrop = true,
	className,
}: ModalProps) {
	useEffect(() => {
		if (value) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [value]);

	if (!value) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onClick={closeOnBackdrop ? setFalse : undefined}
		>
			<div
				className={cn(
					'bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto',
					className
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{(title || showCloseButton) && (
					<div className="flex items-center justify-between p-4 border-b">
						{title && <h2 className="text-lg font-semibold">{title}</h2>}
						{showCloseButton && (
							<button
								type="button"
								onClick={setFalse}
								className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X size={24} />
							</button>
						)}
					</div>
				)}
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
}
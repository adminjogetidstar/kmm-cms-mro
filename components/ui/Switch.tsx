import { cn } from '@shared/utils';
import type React from 'react';

interface SwitchProps {
	value: boolean;
	onChange: (value: boolean) => void;
	labelValue?: [string, string]; // [trueLabel, falseLabel]
	color?: [string, string]; // [trueColor, falseColor]
	disabled?: boolean;
	className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
	value,
	onChange,
	labelValue = ['On', 'Off'],
	color = ['bg-teal-500', 'bg-gray-400'],
	disabled = false,
	className,
}) => {
	const [trueLabel, falseLabel] = labelValue;
	const [trueColor, falseColor] = color;

	const handleToggle = () => {
		if (!disabled) {
			onChange(!value);
		}
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			disabled={disabled}
			role="switch"
			aria-checked={value}
			aria-label={value ? trueLabel : falseLabel}
			className={cn(
				'relative rounded-full h-9 min-w-20 flex gap-1 items-center p-0.5 px-1 transition-all duration-300 ease-in-out',
				value ? trueColor : falseColor,
				disabled && 'opacity-50 cursor-not-allowed',
				!disabled && 'cursor-pointer',
				value && 'flex-row-reverse',
				className
			)}
		>
			<div className="bg-white w-8 h-8 rounded-full" />
			<label className="text-white font-bold">
				{value ? trueLabel : falseLabel}
			</label>
		</button>
	);
};

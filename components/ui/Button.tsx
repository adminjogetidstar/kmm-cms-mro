import { cn } from '@shared/utils';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	size = 'md',
	children,
	className = '',
	...props
}) => {
	const baseStyles =
		'font-semibold rounded-lg transition-all duration-300 border-none cursor-pointer';

	const variantStyles = {
		primary: 'bg-teal-500 text-white hover:bg-primary-dark',
		secondary: 'bg-secondary text-gray-600 hover:bg-secondary-dark',
		danger: 'bg-red-600 text-white hover:bg-red-500',
	};

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-1.5 text-sm',
		lg: 'px-6 py-1.5 text-base',
	};

	return (
		<button
			type="button"
			className={cn(
				'hover:-translate-y-0.5',
				baseStyles,
				variantStyles[variant],
				sizeStyles[size],
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

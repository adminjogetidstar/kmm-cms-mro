import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useBool } from '@shared/hooks/useBool';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	rightAccessory?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ label, error, rightAccessory, className = '', required, ...props },
		ref
	) => {
		const form = useFormContext();
		const formError = form?.formState.errors[props.name as string]
			?.message as string;

		const errorText = error || formError;

		return (
			<div className="mb-4">
				{label && (
					<label className="block mb-2 text-sm font-medium text-gray-700">
						{label}
						{required && (
							<span className="text-red-600 ml-1" title="Required">
								*
							</span>
						)}
					</label>
				)}
				<div className="relative">
					<input
						ref={ref}
						className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-300 focus:outline-none disabled:bg-gray-200 focus:border-primary ${
							rightAccessory ? 'pr-12' : ''
						} ${className}`}
						{...props}
					/>
					{rightAccessory && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2">
							{rightAccessory}
						</div>
					)}
				</div>
				{errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}
			</div>
		);
	}
);

export const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
	(props, ref) => {
		const { value, toggle } = useBool(true);

		const Icon = value ? EyeIcon : EyeSlashIcon;

		return (
			<Input
				ref={ref}
				{...props}
				type={value ? 'password' : 'text'}
				rightAccessory={
					<Icon className="text-lg cursor-pointer" onClick={toggle} />
				}
			/>
		);
	}
);

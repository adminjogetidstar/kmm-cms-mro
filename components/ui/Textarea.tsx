import React from 'react';
import { useFormContext } from 'react-hook-form';

interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, error, className = '', ...props }, ref) => {
		const form = useFormContext();
		const formError = form?.formState.errors[props.name as string]
			?.message as string;

		const errorText = error || formError;

		return (
			<div className="mb-4">
				{label && (
					<label className="block mb-2 text-sm font-medium text-gray-700">
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-y min-h-[80px] transition-colors duration-300 focus:outline-none focus:border-primary ${className}`}
					{...props}
				/>
				{errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}
			</div>
		);
	}
);

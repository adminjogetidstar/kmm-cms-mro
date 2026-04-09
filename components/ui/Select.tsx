import { cn } from '@shared/utils';
import { ChangeEvent, useId, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactSelect, {
	components,
	ClassNamesConfig,
	MultiValueProps,
	OptionProps,
	type Props as ReactSelectProps,
} from 'react-select';

export type SelectOption = { label: string; value: string };

interface BaseSelectProps extends Omit<
	ReactSelectProps<SelectOption, boolean>,
	'options' | 'value' | 'onChange' | 'isMulti' | 'isDisabled'
> {
	name?: string;
	label?: string;
	error?: string;
	options: SelectOption[];
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;
	hideSelected?: boolean;
}
interface SingleSelectProps extends BaseSelectProps {
	multiple?: false;
	multipleAsString?: false;
	value?: string | null;
	onChange?: (event: ChangeEvent<{ value: string }>) => void;
}

interface MultiSelectProps extends BaseSelectProps {
	multiple: true;
	multipleAsString?: false;
	value?: string[];
	onChange?: (event: ChangeEvent<{ value: string[] }>) => void;
}

interface MultiSelectAsStringProps extends BaseSelectProps {
	multiple?: false;
	multipleAsString: true;
	value?: string;
	onChange?: (event: ChangeEvent<{ value: string }>) => void;
}

export type SelectProps =
	| SingleSelectProps
	| MultiSelectProps
	| MultiSelectAsStringProps;

const selectClassNames: ClassNamesConfig<SelectOption> = {
	control: ({ isFocused }) =>
		cn(
			'min-h-[38px] text-sm rounded-lg border !shadow-none',
			isFocused ? 'border-primary' : 'border-gray-300'
		),
	option: ({ isSelected, isFocused }) =>
		cn(
			'text-sm',
			isSelected && 'bg-primary text-white',
			!isSelected && isFocused && 'bg-gray-100'
		),
};

const Option = (props: OptionProps<SelectOption>) => {
	const { isSelected, label } = props;

	return (
		<components.Option {...props}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<input type="checkbox" checked={isSelected} readOnly />
				<span>{label}</span>
			</div>
		</components.Option>
	);
};

const MultiValue = (props: MultiValueProps<SelectOption>) => {
	const selectedCount = props.getValue().length;

	if (props.index > 0) return null;

	return (
		<label style={{ paddingLeft: 8, fontSize: 13 }}>
			{selectedCount} selected
		</label>
	);
};

function Select(props: SelectProps) {
	const [search, setSearch] = useState('');
	const {
		hideSelected = true,
		multipleAsString,
		className,
		name,
		label,
		value: valueProp,
		required,
		options,
		multiple,
		onChange,
		error,
		disabled,
		placeholder,
	} = props;

	const inputId = useId();
	const form = useFormContext();
	const formValue = name && form ? form.watch(name) : undefined;
	const _value = valueProp ?? (formValue as string | null);
	const value = multipleAsString ? (_value as string)?.split?.(',') : _value;

	const formError = form?.formState.errors[name as string]?.message as string;
	const errorText = error || formError;

	function renderSelect() {
		const baseProps = {
			inputId,
			inputValue: search,
			onInputChange: setSearch,
			options: options,
			classNames: selectClassNames,
			isDisabled: disabled,
			placeholder: placeholder,
			hideSelectedOptions: false,
			onBlur: () => setSearch(''),
		};

		if (multiple || multipleAsString) {
			const additionalProps = hideSelected
				? { components: { MultiValue, Option } }
				: {};

			return (
				<ReactSelect
					{...additionalProps}
					{...baseProps}
					isMulti
					closeMenuOnSelect={false}
					blurInputOnSelect={false}
					onInputChange={(newValue, meta) => {
						console.log(meta.action);
						if (meta.action === 'set-value') return;

						setSearch(newValue);
					}}
					value={options.filter((e) => value?.includes(e.value))}
					onChange={(selected, meta) => {
						if (meta.action === 'clear') setSearch('');
						const values = selected.map((e) => e.value);
						const value = multipleAsString ? values.toString() : values;

						onChange?.({ target: { name, value } } as any);
					}}
				/>
			);
		}

		return (
			<ReactSelect
				{...baseProps}
				components={{ Option }}
				isMulti={false}
				value={options.find((e) => e.value === value)}
				onChange={(selected, meta) => {
					if (meta.action === 'clear') setSearch('');

					onChange?.({
						target: { name, value: selected?.value ?? null },
					} as any);
				}}
			/>
		);
	}

	return (
		<div className={cn(label || errorText ? 'mb-5' : '', className)}>
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

			{renderSelect()}
			{errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}
		</div>
	);
}

export default Select;

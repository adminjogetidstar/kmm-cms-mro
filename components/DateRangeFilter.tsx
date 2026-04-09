import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format, parseISO } from 'date-fns';
import { XIcon } from '@phosphor-icons/react';
import 'react-calendar/dist/Calendar.css';
import './DateRangeFilter.css';

type CalendarValue = Date | Date[] | null | [Date | null, Date | null];

interface DateRangeFilterProps {
	isOpen: boolean;
	onClose: () => void;
	onApply: (startDate: string, endDate: string) => void;
	onReset?: () => void;
	initialStartDate?: string;
	initialEndDate?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
	isOpen,
	onClose,
	onApply,
	onReset,
	initialStartDate,
	initialEndDate,
}) => {
	const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
	const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

	useEffect(() => {
		if (isOpen) {
			// Initialize with current values when modal opens
			if (initialStartDate && initialEndDate) {
				setSelectedStartDate(parseISO(initialStartDate));
				setSelectedEndDate(parseISO(initialEndDate));
			} else {
				setSelectedStartDate(null);
				setSelectedEndDate(null);
			}
		}
	}, [isOpen, initialStartDate, initialEndDate]);

	const handleDateClick = (value: CalendarValue) => {
		if (!value) return;

		const date = Array.isArray(value) ? value[0] : value;
		if (!date) return;

		if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
			// Start new selection
			setSelectedStartDate(date);
			setSelectedEndDate(null);
		} else {
			// Complete the range
			if (date >= selectedStartDate) {
				setSelectedEndDate(date);
			} else {
				// If clicked date is before start, swap them
				setSelectedEndDate(selectedStartDate);
				setSelectedStartDate(date);
			}
		}
	};

	const handleApply = () => {
		if (selectedStartDate) {
			const startStr = format(selectedStartDate, 'yyyy-MM-dd');
			const endStr = selectedEndDate
				? format(selectedEndDate, 'yyyy-MM-dd')
				: startStr;
			onApply(startStr, endStr);
			onClose();
		}
	};

	const handleReset = () => {
		setSelectedStartDate(null);
		setSelectedEndDate(null);
		onReset?.();
		onClose();
	};

	if (!isOpen) return null;

	const isDateSelected = !!selectedStartDate;

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50"
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-white rounded-2xl shadow-xl w-[320px] relative"
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
					title="Close"
				>
					<XIcon size={20} weight="bold" className="text-gray-600" />
				</button>

				{/* Date Display Header */}
				<div className="p-4 border-b border-gray-200">
					<div className="flex justify-between items-center gap-4 pr-8">
						<div className="flex-1">
							<div className="text-xs text-gray-500 mb-1">From</div>
							<div className="text-sm font-medium text-gray-800">
								{selectedStartDate
									? format(selectedStartDate, 'EEE, dd MMM yyyy')
									: 'Select date'}
							</div>
						</div>
						<div className="flex-1">
							<div className="text-xs text-gray-500 mb-1">To</div>
							<div className="text-sm font-medium text-gray-800">
								{selectedEndDate
									? format(selectedEndDate, 'EEE, dd MMM yyyy')
									: 'Select date'}
							</div>
						</div>
					</div>
				</div>

				{/* Calendar */}
				<div className="p-4">
					<Calendar
						onChange={handleDateClick}
						value={
							selectedStartDate && selectedEndDate
								? [selectedStartDate, selectedEndDate]
								: selectedStartDate
						}
						selectRange={false}
						className="custom-calendar"
						locale="en-US"
						showNeighboringMonth={false}
					/>
				</div>

				{/* Buttons */}
				<div className="p-4 pt-0 flex gap-3">
					<button
						onClick={handleReset}
						className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors hover:bg-gray-200"
						style={{
							backgroundColor: '#f3f4f6',
							color: '#374151',
						}}
					>
						Reset
					</button>
					<button
						onClick={handleApply}
						disabled={!isDateSelected}
						className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600"
						style={{
							backgroundColor: isDateSelected ? '#00B2A0' : '#e0e0e0',
							color: isDateSelected ? 'white' : '#9ca3af',
						}}
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default DateRangeFilter;
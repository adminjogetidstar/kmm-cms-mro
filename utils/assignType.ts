import { AssignType } from '../types/backend';

/**
 * Check if assign type is vendor
 */
export const isVendor = (type: AssignType | string | null | undefined): boolean => {
	return type === AssignType.VENDOR;
};

/**
 * Check if assign type is internal
 */
export const isInternal = (type: AssignType | string | null | undefined): boolean => {
	return type === AssignType.INTERNAL;
};

/**
 * Convert string to AssignType enum
 */
export const toAssignType = (value: string): AssignType | null => {
	if (value === 'vendor') return AssignType.VENDOR;
	if (value === 'internal') return AssignType.INTERNAL;
	return null;
};

/**
 * Get assign type display name
 */
export const getAssignTypeLabel = (type: AssignType | string | null | undefined): string => {
	if (isVendor(type)) return 'Vendor';
	if (isInternal(type)) return 'Internal';
	return '-';
};

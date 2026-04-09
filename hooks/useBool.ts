import { useState, useCallback } from 'react';

export type UseBoolReturn = ReturnType<typeof useBool>;

export function useBool(defaultOpen = false) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	return {
		value: isOpen,
		setTrue: open,
		setFalse: close,
		toggle,
	};
}

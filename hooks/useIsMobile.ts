import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile viewport
 * @param breakpoint - breakpoint in pixels (default: 768 for md breakpoint)
 * @returns boolean indicating if viewport is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, [breakpoint]);

	return isMobile;
}

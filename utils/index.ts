export * from './cn';
export * from './navigator';
export * from './assignType';

export function getGreeting(date = new Date()) {
	const hour = date.getHours();
	if (hour >= 18 || hour < 5) return 'Good Night';
	else if (hour >= 15) return 'Good Evening';
	else if (hour >= 12) return 'Good Afternoon';
	else return 'Good Morning';
}

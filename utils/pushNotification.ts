const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
	if (!('Notification' in window)) {
		console.warn('This browser does not support notifications');
		return 'denied';
	}
	return Notification.requestPermission();
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	if (!('serviceWorker' in navigator)) {
		console.warn('Service Worker not supported');
		return null;
	}

	try {
		const registration = await navigator.serviceWorker.register('/sw.js');
		await navigator.serviceWorker.ready;
		return registration;
	} catch (error) {
		console.error('Service Worker registration failed:', error);
		return null;
	}
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
	const registration = await registerServiceWorker();
	if (!registration) return null;

	if (!VAPID_PUBLIC_KEY) {
		console.error('VAPID_PUBLIC_KEY is not set');
		return null;
	}

	try {
		const subscription = await registration.pushManager.subscribe({
			// @ts-ignore
			applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
			userVisibleOnly: true,
		});
		return subscription;
	} catch (error) {
		console.error('Push subscription failed:', error);
		return null;
	}
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
	if (!('serviceWorker' in navigator)) {
		return null;
	}

	try {
		// Check if there's an existing registration first
		const registration = await navigator.serviceWorker.getRegistration();
		if (!registration) {
			return null;
		}
		return registration.pushManager.getSubscription();
	} catch (err) {
		console.error({ err });
		return null;
	}
}

export async function unsubscribeFromPush(): Promise<boolean> {
	const subscription = await getExistingSubscription();
	if (!subscription) return true;

	try {
		return await subscription.unsubscribe();
	} catch (error) {
		console.error('Unsubscribe failed:', error);
		return false;
	}
}

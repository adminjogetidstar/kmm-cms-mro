import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authApi, unregisterPushToken } from '@shared/api';
import { logout as logoutAction } from '@shared/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
	getExistingSubscription,
	unsubscribeFromPush,
} from '../utils/pushNotification';

export const useLogout = () => {
	const dispatch = useDispatch();
	const navigateTo = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: async () => {
			// Unsubscribe from push notifications before logout

			const subscription = await getExistingSubscription();
			if (subscription) {
				await unregisterPushToken(subscription.endpoint).catch(console.error);
				await unsubscribeFromPush();
			}

			return authApi.logout();
		},
		onSuccess: () => {
			// Dispatch logout action to clear Redux state and localStorage
			dispatch(logoutAction());

			// Navigate to login
			navigateTo('/login', { replace: true });
		},
		onError(error) {
			console.error(error);
		},
	});

	const logout = () => {
		logoutMutation.mutate();
	};

	return {
		logout,
		isLoading: logoutMutation.isPending,
	};
};

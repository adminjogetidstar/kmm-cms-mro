import { useRef } from 'react';
import { makeStore, type AppStore } from './store';
import { Provider } from 'react-redux';
import type { Reducer } from '@reduxjs/toolkit';

interface StoreProviderProps {
	children: React.ReactNode;
	reducers?: Record<string, Reducer>;
}

export default function StoreProvider({
	children,
	reducers,
}: StoreProviderProps) {
	const storeRef = useRef<AppStore>();
	if (!storeRef.current) {
		storeRef.current = makeStore(reducers);
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}

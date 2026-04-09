import { configureStore, type Reducer } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const makeStore = (additionalReducers?: Record<string, Reducer>) => {
	return configureStore({
		reducer: {
			auth: authReducer.reducer,
			...additionalReducers,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

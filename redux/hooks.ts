import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppStore, RootState } from './store';

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

import type {
	ActionCreatorWithoutPayload,
	ActionCreatorWithPayload,
	AsyncThunk,
	PayloadAction,
	Slice,
	WritableDraft,
} from '@reduxjs/toolkit';
import { type Connect, connect } from 'react-redux';
import { type Dispatch } from 'redux';

type ReducerFunction<State, Payload> = (
	state: State,
	action: PayloadAction<Payload>
) => void;

export type ReducerObject<State, T extends {}> = {
	[K in keyof T]: ReducerFunction<WritableDraft<State>, T[K]>;
};

export const connectState: Connect<RootState> = connect;

export function useReduxValue<K extends keyof RootState>(key: K) {
	return useAppSelector((state) => state[key]);
}

export function useAppDispatch<R, P, C>(
	// @ts-ignore
	action: AsyncThunk<R, P, C>
): (payload: P) => void;
export function useAppDispatch<R, C>(
	// @ts-ignore
	action: AsyncThunk<R, void, C>
): () => void;
export function useAppDispatch<P>(
	action: ActionCreatorWithPayload<P>
): (payload: P) => void;
export function useAppDispatch(action: ActionCreatorWithoutPayload): () => void;
export function useAppDispatch(): Dispatch<any>;
export function useAppDispatch(action?: any) {
	const dispatch = useDispatch();

	if (!action) return dispatch;

	return (payload?: unknown) => {
		dispatch(action(payload));
	};
}

export function useSlice<T extends Slice>(rtk: T) {
	type S = ReturnType<T['getInitialState']>;

	const dispatch = useDispatch();
	const value = useSelector((state) => (state as any)[rtk.name]) as S;

	function rtkDispatch<
		A extends keyof T['actions'],
		P extends Parameters<T['actions'][A]>[0]
	>(actionName: A, payload?: P) {
		// @ts-ignore
		dispatch(rtk.actions[actionName](payload));
	}

	return [value, rtkDispatch] as const;
}

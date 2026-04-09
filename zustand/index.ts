'use client';

import { Draft } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Reducer<S, P extends any[] = any[]> = (
	draft: Draft<S>,
	...args: P
) => void;
type Reducers<S> = Record<string, Reducer<S>>;
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;
type Action<R extends Reducers<any>> = {
	[K in keyof R]: (...args: Tail<Parameters<R[K]>>) => void;
};

export default function createZustand<S extends object, R extends Reducers<S>>(
	initialState: S,
	reducers?: R
) {
	type Actions = Action<R> & DefaultActions;
	type DefaultActions = {
		resetToInitial(): void;
		reinitialize(newState: S): void;
	};

	const useZustand = create<{ state: S } & Actions>()(
		immer((set) => {
			const actions = {} as Actions;

			for (const key in reducers) {
				actions[key] = ((...args: any[]) =>
					set((draft: any) => {
						reducers[key](draft.state, ...args);
					})) as Actions[typeof key];
			}

			return {
				...actions,
				state: initialState,
				resetToInitial() {
					set((draft: any) => {
						draft.state = initialState;
					});
				},
				reinitialize(newState: S) {
					set((draft: any) => {
						draft.state = newState;
					});
				},
			};
		})
	);

	const useValue = () => useZustand((s) => s.state);
	const useSet = () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { state, ...set } = useZustand.getState();
		return set;
	};

	const use = () => [useValue(), useSet()] as const;

	return { use, useValue, useSet };
}

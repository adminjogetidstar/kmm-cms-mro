import { useEffect } from 'react';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

let _navigator: NavigateFunction | null = null;

export function LoadNavigator() {
	const nav = useNavigate();

	useEffect(() => {
		setTopLevelNavigator(nav);
	}, [nav]);

	return null;
}

export function setTopLevelNavigator(navigatorRef: NavigateFunction) {
	if (navigatorRef) {
		_navigator = navigatorRef;
	}
}

export function getNavigator() {
	return _navigator;
}

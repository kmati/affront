import { Router } from './Router';
import { Component } from './Component';
import { Store } from './Store';

// TODO: Ensure that the exact same store instance is being used in all cases!!! Singleton.
export const Affront = {
	Router: new Router(),
	ViewComponent: Component.ViewComponent,
	NonVisualComponent: Component.NonVisualComponent,
	Store: Store
};

if (!window) window = {};
window.Affront = Affront;
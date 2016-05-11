import { Router } from './Router';
import { Component } from './Component';
import { Store } from './Store';

export const Affront = {
	Router: new Router(),
	ViewComponent: Component.ViewComponent,
	NonVisualComponent: Component.NonVisualComponent,
	Store: Store
};

if (!window) window = {};
window.Affront = Affront;
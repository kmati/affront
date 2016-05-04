import { Router } from './Router';
import { Component } from './Component';

export const Affront = {
	Router: new Router(),
	Component: Component
};

if (!window) window = {};
window.Affront = Affront;
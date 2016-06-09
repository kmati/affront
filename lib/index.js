import { Router } from './Router';
import { Component } from './Component';
import { Control } from './Control';
import { Store } from './Store';
import { Http } from './Http';

// The Affront API
export const Affront = {
	Router: new Router(),
	ViewComponent: Component.ViewComponent,
	TemplateViewComponent: Component.TemplateViewComponent,
	NonVisualComponent: Component.NonVisualComponent,
	Control: Control,
	Store: Store,
	Http: Http,

	// This method should be called when the app has finished loading components and wants to actually start!
	start: function () {
		this.Router.init();
	}
};

// Add the Affront library to the browser's window object
if (!window) window = {};
window.Affront = Affront;
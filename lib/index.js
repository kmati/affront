import { Router } from './Router';
import { Component } from './Component';
import { Store } from './Store';
import { Http } from './Http';

export const Affront = {
	Router: new Router(),
	ViewComponent: Component.ViewComponent,
	TemplateViewComponent: Component.TemplateViewComponent,
	NonVisualComponent: Component.NonVisualComponent,
	Store: Store,
	Http: Http,

	// This method should be called when the app has finished loading components and wants to actually start!
	start: function () {
		this.Router.init();
	}
};

if (!window) window = {};
window.Affront = Affront;
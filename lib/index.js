import { Router } from './Router';
import { Component } from './Component';
import { Store } from './Store';

export const Affront = {
	Router: new Router(),
	ViewComponent: Component.ViewComponent,
	TemplateViewComponent: Component.TemplateViewComponent,
	NonVisualComponent: Component.NonVisualComponent,
	Store: Store,

	// This method should be called when the app has finished loading components and wants to actually start!
	start: function () {
		this.Router.init();
	}
};

if (!window) window = {};
window.Affront = Affront;
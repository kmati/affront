import { ComponentBase } from './ComponentBase';

// The base class for non-visual components
export class NonVisualComponent extends ComponentBase {
	// The constructor of a non-visual component
	// routeUrl: The route url to which the component is bound
	constructor(routeUrl) {
		super(routeUrl);
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		console.log('[NonVisualComponent.urlChangedRender] invoked | ctxt = ',ctxt);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// storeItem: a StoreItem instance
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	notificationRender(storeItem, notificationOptions) {
		console.log('[NonVisualComponent.notificationRender] invoked | storeItem = ',storeItem);
	}

	// Invoked when the component is about to hide itself
	hide() {
		console.log('[NonVisualComponent.hide] invoked');
	}
};
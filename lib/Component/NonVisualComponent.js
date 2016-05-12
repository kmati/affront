import { ComponentBase } from './ComponentBase';

export class NonVisualComponent extends ComponentBase {
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
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		console.log('[NonVisualComponent.notificationRender] invoked | storeItem = ',storeItem);
	}

	hide() {
		console.log('[NonVisualComponent.hide] invoked');
	}
};
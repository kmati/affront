import { ComponentBase } from './ComponentBase';
import 'friedjuju/src/json-to-markup/j2m.js';

export class ViewComponent extends ComponentBase {
	// routeUrl: The route url to which the component is bound
	// domContainerElement: The element that will be rendered into
	constructor(routeUrl, domContainerElement) {
		super(routeUrl);
		this.domContainerElement = domContainerElement;
	}

	updateDOM(markupStr) {
		j2m.updateDOMFromMarkupString(markupStr, this.domContainerElement);
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		console.log('[ViewComponent.urlChangedRender] invoked | ctxt = ',ctxt);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {

		console.log('[ViewComponent.notificationRender] invoked | storeItem = ',storeItem);
	}

	hide() {
		console.log('[ViewComponent.hide] invoked');
	}
};
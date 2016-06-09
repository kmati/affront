import { ComponentBase } from './ComponentBase';
import { Control } from '../Control';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import 'friedjuju/src/json-to-markup/j2m.js';

// The base class for all visual components that do NOT have templates.
// These visual components can have controls to encapsulate internal visual functionality.
export class ViewComponent extends ComponentBase {
	// The constructor for a visual component that does NOT have any templates
	// routeUrl: The route url to which the component is bound
	// domContainerElement: The element that will be rendered into
	constructor(routeUrl, domContainerElement) {
		super(routeUrl);
		this.domContainerElement = domContainerElement;

		this.controls = {};
	}

	// Adds a control to the visual component
	// control: A Control instance
	addControl(control) {
		if (!(control instanceof Control)) {
			throw new InvalidArgumentError('Cannot add control because it is invalid');
		}
		this.controls[control.id] = control;
	}

	// Removes a control from the visual component
	// val: Either a controlId or a Control instance
	removeControl(val) {
		if (val instanceof Control) {
			delete this.controls[val.id];
		} else {
			delete this.controls[val];
		}
	}

	// Updates the DOM container element with markup
	// markupStr: The markup to update the DOM container element with (i.e. set innerHTML with)
	updateDOM(markupStr) {
		j2m.updateDOMFromMarkupString(markupStr, this.domContainerElement);

		if (this.controls) {
			for (let controlId in this.controls) {
				const control = this.controls[controlId];
				control.onDOMUpdated(this.domContainerElement, this.lastEvent);
			}
		}
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		console.log('[ViewComponent.urlChangedRender] invoked | ctxt = ',ctxt);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// storeItem: a StoreItem instance
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	notificationRender(storeItem, notificationOptions) {
		console.log('[ViewComponent.notificationRender] invoked | storeItem = ',storeItem);
	}

	// Invoked when the component is about to hide itself
	hide() {
		console.log('[ViewComponent.hide] invoked');
	}
};
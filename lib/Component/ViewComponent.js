import { ComponentBase } from './ComponentBase';
import { Control } from '../Control';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import 'friedjuju/src/json-to-markup/j2m.js';

export class ViewComponent extends ComponentBase {
	// routeUrl: The route url to which the component is bound
	// domContainerElement: The element that will be rendered into
	constructor(routeUrl, domContainerElement) {
		super(routeUrl);
		this.domContainerElement = domContainerElement;

		this.controls = {};
	}

	addControl(control) {
		if (!(control instanceof Control)) {
			throw new InvalidArgumentError('Cannot add control because it is invalid');
		}
		this.controls[control.id] = control;
	}

	// val: Either controlId or control instance
	removeControl(val) {
		if (val instanceof Control) {
			delete this.controls[val.id];
		} else {
			delete this.controls[val];
		}
	}

	updateDOM(markupStr) {
		j2m.updateDOMFromMarkupString(markupStr, this.domContainerElement);

		if (this.controls) {
			for (let controlId in this.controls) {
				this.controls[controlId].onDOMUpdated(this.domContainerElement));
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
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		console.log('[ViewComponent.notificationRender] invoked | storeItem = ',storeItem);
	}

	hide() {
		console.log('[ViewComponent.hide] invoked');
	}
};
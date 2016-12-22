import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import { NotImplementedError } from '../errors/NotImplementedError';
import mustache from 'mustache';
import '../utils/Function';

// The base class for a control
export class Control {
	// The constructor of a control
	// id: The id of the control
	// template: The template used for rendering the control
	// localCSS: An object whose properties are CSS class names and whose values are the localized CSS class names
	//		The control will change the matching CSS class names in the templates.
	constructor(id, template, localCSS) {
		if (typeof id !== 'string' || !isNaN(id)) {
			throw new InvalidArgumentError('Cannot create the control because the id is not a string');
		}
		if (id.length < 1) {
			throw new InvalidArgumentError('Cannot create the control because the id is not a non-empty string');
		}
		if (null === template || undefined === template) {
			throw new InvalidArgumentError('Cannot create the control because the template cannot be null or undefined');
		}
		if (typeof template !== 'string') {
			throw new InvalidArgumentError('Cannot create the control because the template is not a string');
		}

		this.id = id;
		this.template = template;

		if (template && localCSS) {
			// localize the CSS class names in the templates
			for (const oCN in localCSS) {
				const nCN = localCSS[oCN];
				this.template = this.template
					.replace(new RegExp(`class="${oCN}"`, 'gi'), `class="${nCN}"`)
					.replace(new RegExp(`class='${oCN}'`, 'gi'), `class='${nCN}'`);
			}
		}

		this.controls = {};
	}

	// Adds a child control to the control
	// control: The Control instance
	addControl(control) {
		if (!(control instanceof Control)) {
			throw new InvalidArgumentError('Cannot add sub-control because it is invalid');
		}
		this.controls[control.id] = control;
	}

	// Removes a child control from the control
	// val: Either a controlId or a Control instance
	removeControl(val) {
		if (val instanceof Control) {
			delete this.controls[val.id];
		} else {
			delete this.controls[val];
		}
	}

	// Renders the control (and all its contained controls)
	// data: The object that contains the data to substitute into the template
	// eventObj: Event related data for the event that caused the control to render
	render(data, eventObj) {
		if (this.controls) {
			const controlData = {};
			for (let controlId in this.controls) {
				const control = this.controls[controlId];
				controlData[control.constructor.getConstructorName()] = {};
				controlData[control.constructor.getConstructorName()][control.id] = control.render(data, eventObj);
			}

			for (let key in controlData) {
				data[key] = controlData[key];
			}
		}

		return mustache.render(this.template, data);
	}

	// This method is invoked so the control can bind events after the DOM has been updated
	// domContainerElement: The DOM container element into which the control was rendered
	// eventObj: Event related data for the event that caused the control to render
	onDOMUpdated(domContainerElement, eventObj) {
		if (this.onDOMUpdatedNotification) {
			this.onDOMUpdatedNotification(domContainerElement, eventObj);
		}

		if (this.controls) {
			for (let controlId in this.controls) {
				const control = this.controls[controlId];
				control.onDOMUpdated(domContainerElement, eventObj);
			}
		}
	}

	// The Control classes that extend this type can add custom logic here to be executed after the domContainerElement
	// has been updated
	// domContainerElement: The DOM container element into which the control was rendered
	// eventObj: Event related data for the event that caused the control to render
	onDOMUpdatedNotification(domContainerElement, eventObj) {
	}
};
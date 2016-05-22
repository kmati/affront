import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import { NotImplementedError } from '../errors/NotImplementedError';
import mustache from 'mustache';

export class Control {
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

	addControl(control) {
		if (!(control instanceof Control)) {
			throw new InvalidArgumentError('Cannot add sub-control because it is invalid');
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

	render(data) {
		if (this.controls) {
			const controlData = {};
			for (let controlId in this.controls) {
				const control = this.controls[controlId];
				controlData[control.constructor.name] = {};
				controlData[control.constructor.name][control.id] = control.render(data);
			}

			for (let key in controlData) {
				data[key] = controlData[key];
			}
		}

		return mustache.render(this.template, data);
	}

	// This method is invoked so the control can bind events after the DOM has been updated
	// domContainerElement: The DOM container element into which the control was rendered
	onDOMUpdated(domContainerElement) {
		if (this.onDOMUpdatedNotification) {
			this.onDOMUpdatedNotification(domContainerElement);
		}

		if (this.controls) {
			for (let controlId in this.controls) {
				const control = this.controls[controlId];
				control.onDOMUpdated(this.domContainerElement);
			}
		}
	}

	// The Control classes that extend this type can add custom logic here to be executed after the domContainerElement
	// has been updated
	onDOMUpdatedNotification(domContainerElement) {
	}
};
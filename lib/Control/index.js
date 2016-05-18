import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import { NotImplementedError } from '../errors/NotImplementedError';

export class Control {
	constructor(id, template, localCSS) {
		this.id = id;
		if (null === template || undefined === template) {
			throw new InvalidArgumentError('Cannot create the control because the template cannot be null or undefined');
		}
		if (typeof template !== 'string') {
			throw new InvalidArgumentError('Cannot create the control because the template is not a string');
		}
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
		if (val instanceof Control)) {
			delete this.controls[val.id];
		} else {
			delete this.controls[val];
		}
	}

	render(data) {
		let content = mustache.render(this.template, data);
		
		if (this.controls && this.controls.length > 0) {
			const controlData = {};
			this.controls.forEach(control => {
				controlData[control.constructor.name] = {};
				controlData[control.constructor.name][control.id] = control.render(data);
			});
			content = mustache.render(content, control);
		}

		return content;
	}

	// This method is invoked so the control can bind events after the DOM has been updated
	// domContainerElement: The DOM container element into which the control was rendered
	onDOMUpdated(domContainerElement) {
		if (this.controls && this.controls.length > 0) {
			this.controls.forEach(control => control.onDOMUpdated(this.domContainerElement));
		}
	}
};
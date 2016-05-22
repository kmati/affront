import { ViewComponent } from './ViewComponent';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import mustache from 'mustache';

export class TemplateViewComponent extends ViewComponent {
	// routeUrl: The route url to which the component is bound
	// domContainerElement: The element that will be rendered into
	// templates: An object whose properties are template names and whose values are the content of the templates
	// localCSS: An object whose properties are CSS class names and whose values are the localized CSS class names
	//		The component will change the matching CSS class names in the templates.
	constructor(routeUrl, domContainerElement, templates, localCSS) {
		super(routeUrl, domContainerElement);
		this.templates = templates || {};

		if (templates && localCSS) {
			// localize the CSS class names in the templates
			for (const name in this.templates) {
				let content = this.templates[name];
				for (const oCN in localCSS) {
					const nCN = localCSS[oCN];
					content = content
						.replace(new RegExp(`class="${oCN}"`, 'gi'), `class="${nCN}"`)
						.replace(new RegExp(`class='${oCN}'`, 'gi'), `class='${nCN}'`);
				}
				this.templates[name] = content;
			}
		}
	}

	addTemplate(name, content) {
		this.templates[name] = content;
	}

	removeTemplate(name) {
		delete this.templates[name];
	}

	// Renders a named template
	// A template is a string that will be replaced using mustache.
	// For controls within the template, you should use: {{ControlClassName.ControlId}},
	//	e.g. {{MyControl.123}} => where the class is MyControl and the id is 123.
	renderTemplate(name, data) {
		let templateStr = this.templates[name];
		if (!templateStr) {
			throw new InvalidArgumentError(`No template was found with the name: "${name}"`);
		}

		// we clone the data to prevent pollution of the store item!!!
		let clonedData = {};
		for (let key in data) {
			clonedData[key] = data[key];
		}

		if (this.controls) {
			const controlData = {};
			for (let controlId in this.controls) {
				const control = this.controls[controlId];
				controlData[control.constructor.name] = {};
				controlData[control.constructor.name][control.id] = control.render(clonedData, this.lastEvent);
			}

			for (let key in controlData) {
				clonedData[key] = controlData[key];
			}
		}

		return mustache.render(templateStr, clonedData);
	}
};
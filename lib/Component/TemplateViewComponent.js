import { ViewComponent } from './ViewComponent';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import mustache from 'mustache';
import '../utils/String';
import '../utils/Function';

// The characters that immediately follow a CSS class referenced in an HTML class attribute
const classNameTrailers = [' ', '"', '\''];

// The base class for all visual components that use templates
export class TemplateViewComponent extends ViewComponent {
	// The constructor for a visual component that uses templates
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

					// replace oCN CSS class names in the class attributes
					content = content.replaceWithin('class="', '"', oCN, classNameTrailers, nCN)
						.replaceWithin('class=\'', '\'', oCN, classNameTrailers, nCN)
						.replaceWithin('CLASS="', '"', oCN, classNameTrailers, nCN)
						.replaceWithin('CLASS=\'', '\'', oCN, classNameTrailers, nCN);
				}
				this.templates[name] = content;
			}
		}
	}

	// Adds a template to the component
	// name: The name of the template
	// content: The content of the template
	addTemplate(name, content) {
		this.templates[name] = content;
	}

	// Removes a template from the component
	// name: The name of the template
	removeTemplate(name) {
		delete this.templates[name];
	}

	// Renders a named template
	// A template is a string that will be replaced using mustache.
	// For controls within the template, you should use: {{ControlClassName.ControlId}},
	//	e.g. {{MyControl.123}} => where the class is MyControl and the id is 123.
	// name: The name of the template to render
	// data: The object that contains the data to substitute into the template
	// Returns: The rendered content
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
				controlData[control.constructor.getConstructorName()] = {};
				controlData[control.constructor.getConstructorName()][control.id] = control.render(clonedData, this.lastEvent);
			}

			for (let key in controlData) {
				clonedData[key] = controlData[key];
			}
		}

		return mustache.render(templateStr, clonedData);
	}
};
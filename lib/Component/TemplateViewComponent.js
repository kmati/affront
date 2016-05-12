import { ViewComponent } from './ViewComponent';
import mustache from 'mustache';

export class TemplateViewComponent extends ViewComponent {
	// routeUrl: The route url to which the component is bound
	// domContainerElement: The element that will be rendered into
	// templates: An object whose properties are template names and whose values are the content of the templates
	constructor(routeUrl, domContainerElement, templates) {
		super(routeUrl, domContainerElement);
		this.templates = templates || {};
	}

	addTemplate(name, content) {
		this.templates[name] = content;
	}

	removeTemplate(name) {
		delete this.templates[name];
	}

	renderTemplate(name, data) {
		return mustache.render(this.templates[name], data);
	}
};
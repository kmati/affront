import { ViewComponent } from './ViewComponent';
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

	renderTemplate(name, data) {
		return mustache.render(this.templates[name], data);
	}
};
import { Component } from './Component';
import { InvalidArgumentError } from './errors/InvalidArgumentError';

export class Router {
	constructor() {
		this.init();
		this.components = [];
	}

	init() {
		const self = this;
	    // Revert to a previously saved state
	    window.addEventListener('popstate', function(event) {
			console.log('popstate fired!');
			self.onStateChanged(event.state);
	    });

	    // Store the initial content so we can revisit it later
		let state = {
			title: document.title,
			url: document.location.href,
			origin: 'init'
		}; // TODO: Figure out what to do with the state
	    history.replaceState(state, document.title, document.location.href);
	}

	// Used to bind <a> elements
	bindLinkElement(ele) {
		const self = this;
		function clickHandler(event) {
			let state = {
				title: event.target.textContent,
				url: event.target.href,
				origin: 'clicked'
			}; // TODO: Figure out what to do with the state
			self.onStateChanged(state);

			// Add an item to the history log
			history.pushState(state, event.target.textContent, event.target.href);

			return event.preventDefault();
		}
		ele.addEventListener('click', clickHandler, true);
	}

	onStateChanged(newState) {
		console.log('[Router.onStateChanged] newState = ',newState);

		// TODO: Find the components that are bound to the current url in document.location.href
		// 	then call the render method on each
		this.components.forEach(component => component.onUrlChanged(newState.url));
	}

	// Adds a routable component
	// component: An instance of Component
	addComponent(component) {
		if (!(component instanceof Component)) {
			throw new InvalidArgumentError('Cannot add component because it is invalid', component);
		}

		if (this.components.findIndex(c => c === component) === -1) {
			this.components.push(component);
		}
	}
};

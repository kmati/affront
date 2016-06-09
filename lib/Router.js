import { ComponentBase } from './Component/ComponentBase';
import { InvalidArgumentError } from './errors/InvalidArgumentError';
import { Store } from './Store';

// The router handles client-side route changes
export class Router {
	// The default constructor of a router
	constructor() {
		Store.router = this;
		this.components = [];

		const self = this;
	    // Revert to a previously saved state
	    window.addEventListener('popstate', function(event) {
			event.state.isPopState = true;
			self.onStateChanged(event.state);
	    });
	}

	// Initializes the router
	init() {
	    // Store the initial content so we can revisit it later
		let state = {
			title: document.title,
			url: document.location.href,
			origin: 'init'
		}; // TODO: Figure out what to do with the state
	    history.replaceState(state, document.title, document.location.href);
	    this.onStateChanged(state);
	}

	// Invoked to bind the <a> elements to client-side route changes
	// ele: An anchor element
	bindLinkElement(ele) {
		const self = this;
		function clickHandler(event) {
			let title;
			let url;
			if (event.currentTarget) {
				title = event.currentTarget.textContent;
				url = event.currentTarget.href;
			} else {
				title = event.target.textContent;
				url = event.target.href;
			}

			const state = {
				title: title,
				url: url,
				origin: 'clicked'
			}; // TODO: Figure out what to do with the state
			self.onStateChanged(state);

			// Add an item to the history log
			history.pushState(state, title, url);

			return event.preventDefault();
		}

		if (!ele.hasClickHandler) {
			// ele's click handler is NOT yet bound, so bind it now
			ele.addEventListener('click', clickHandler, true);
			ele.hasClickHandler = true;
		}
	}

	// The handler that is invoked whenever the client-side route changes
	// newState: The new state information about the client-side route
	onStateChanged(newState) {
		// find the components that are bound to the current url in document.location.href
		// and call the render method on each
		this.components.forEach(component => component.onUrlChanged(newState.url));

		if (newState.isPopState) {
			// going backward/forward to a previous url
			const versionNumber = Store.findLatestMatchingVersionNumber('Router', storeItem => storeItem.value.url === newState.url);
			if (versionNumber > -1) {
				let forwardVerArr = Store.rewindToVersion(versionNumber);
				if (!this.forwardVersions) {
					this.forwardVersions = forwardVerArr;
				} else {
					this.forwardVersions = forwardVerArr.concat(this.forwardVersions);
				}
			} else {
				const maxFVIndex = this.findForwardVersionIndexWithRoute(newState.url);
				if (maxFVIndex > -1) {
					// we found the forward version which means we're going forward to it
					for (let c = 0; c <= maxFVIndex; c++) {
						Store.appendVersion(this.forwardVersions[c]);
					}
					this.forwardVersions.splice(0, maxFVIndex + 1);
				} else {
					// no forward version found which means that this is a new route so set the new route!
					Store.setItemAtNextVersion('Router', newState);
				}
				Store.sendNotificationsForCurrentVersion({ isRouting: true });
			}
		} else {
			// going to a new url
			Store.setItemAtNextVersion('Router', newState);
			Store.sendNotificationsForCurrentVersion({ isRouting: true });
		}
	}

	// Finds the index of a version that is "forward" relative to the current client-side route
	// routeUrl: The future route
	// Returns: The index if found, else -1
	findForwardVersionIndexWithRoute(routeUrl) {
		if (this.forwardVersions) {
			for (let c = 0; c < this.forwardVersions.length; c++) {
				const fv = this.forwardVersions[c];
				if (fv.data.get('Router').value.url === routeUrl) {
					return c;
				}
			}
		}
		return -1;
	}

	// Invoked by the Store when an item is set so that the future versions can be disposed of
	// storeItem: The store item
	onSetItem(storeItem) {
		if (storeItem.key !== 'Router') {
			delete this.forwardVersions;
		}
	}

	// Adds a routable component
	// component: A Component instance
	addComponent(component) {
		if (!(component instanceof ComponentBase)) {
			throw new InvalidArgumentError('Cannot add component because it is invalid', component);
		}

		if (this.components.findIndex(c => c === component) === -1) {
			this.components.push(component);
		}
	}
};

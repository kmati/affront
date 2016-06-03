import { UrlContext } from '../UrlContext';
import { NotImplementedError } from '../errors/NotImplementedError';
import { Store } from '../Store';
import { Events } from '../Events';

const Mode = {
	Rendered: 'rendered',
	Hidden: 'hidden'
};

export class ComponentBase {
	constructor(routeUrl) {
		this.routeUrl = routeUrl;
		this.routeParts = ComponentBase.parseRoute(routeUrl);
		this.mode = Mode.Hidden;
		this.lastEvent = null;
	}

	subscribe(key) {
		const self = this;
		return Store.subscribe(key, function (storeItem, notificationOptions) {
			if (self.mode === Mode.Rendered) {
				self.lastEvent = new Events.NotificationEvent(storeItem);
				self.notificationRender(storeItem, notificationOptions);
			}
		});
	}

	onUrlChanged(url) {
		if (url.substr(0, 5) === 'http:' ||
			url.substr(0, 6) === 'https:') {

			const loc = url.indexOf('/', 8);
			url = url.substr(loc);
		}
		const urlParams = this.routeParts.matchUrlAndGetParams(url);
		if (urlParams) {
			const ctxt = new UrlContext(url, urlParams);
			try {
				if (this.mode === Mode.Hidden) {
					this.lastEvent = new Events.RouteChangedEvent(ctxt);
					this.urlChangedRender(ctxt);
					this.mode = Mode.Rendered;
				}
			} catch (e) {
				console.error(e);
			}
		} else if (this.mode === Mode.Rendered) {
			this.hide();
			this.mode = Mode.Hidden;
		}
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		throw new NotImplementedError('urlChangedRender method not yet implemented');
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// storeItem: a StoreItem instance
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	notificationRender(storeItem, notificationOptions) {
		throw new NotImplementedError('notificationRender method not yet implemented');
	}

	hide() {
		throw new NotImplementedError('hide method not yet implemented');
	}

	// Helper method that extracts the route parts from a route url
	// Example routeUrl:
	//	/person
	//	/person/:id
	//	/person/:id/address
	static parseRoute(routeUrl) {
		let piecesArr = [];
		routeUrl.split('/').forEach(piece => {
			piece = piece.trim();
			if (piece[0] === ':') {
				piecesArr.push({ type: 'parameter', name: piece.substr(1) });
			} else if (piece.length > 0) {
				piecesArr.push({ type: 'text', value: piece });
			}
		});
		return {
			pieces: piecesArr,
			matchUrlAndGetParams: function (url) {
				let urlSegments = url.split('/').filter(f => f.trim().length > 0);
				if (urlSegments.length !== this.pieces.length) {
					// # of segments is different so NOT MATCHED!
					return null;
				}

				const urlParameters = {};

				for (let c = 0; c < urlSegments.length; c++) {
					let urlSegment = urlSegments[c],
						componentPiece = this.pieces[c];
					if (componentPiece.type === 'text' && componentPiece.value !== urlSegment) {
						// the url segment does NOT match!
						return null;
					} else if (componentPiece.type === 'parameter') {
						urlParameters[componentPiece.name] = urlSegment;
					}
				}

				return urlParameters;
			}
		};
	}
};
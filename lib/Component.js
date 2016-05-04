import { UrlContext } from './UrlContext';
import { NotImplementedError } from './errors/NotImplementedError';

export class Component {
	constructor(routeUrl) {
		this.routeParts = Component.parseRoute(routeUrl);
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
				this.render(ctxt);
			} catch (e) {
				console.error(e);
			}
		}
	}

	// ctxt: instance of UrlContext
	render(ctxt) {
		throw new NotImplementedError('render method not yet implemented');
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
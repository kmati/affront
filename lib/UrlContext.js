// The context of a route url
export class UrlContext {
	// The constructor of an url context
	// url: The route url
	// params: The route parameters
	constructor(url, params) {
		this.url = url;
		this.params = params;
	}
};
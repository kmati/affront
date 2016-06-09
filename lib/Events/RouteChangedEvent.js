import { EventBase } from './EventBase';

// The route changed event class that is to be used when there is a client-side route change
export class RouteChangedEvent extends EventBase {
	// The constructor of a route changed event
	// ctxt: The route information
	constructor(ctxt) {
		super();
		this.value = ctxt;
	}
};
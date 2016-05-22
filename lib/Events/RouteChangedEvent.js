import { EventBase } from './EventBase';

export class RouteChangedEvent extends EventBase {
	constructor(ctxt) {
		super();
		this.value = ctxt;
	}
};
import { EventBase } from './EventBase';

// The notification event class that is to be used when there is a Store item change that leads to a notification
export class NotificationEvent extends EventBase {
	// The constructor of a notification event
	// storeItem: A store item
	constructor(storeItem) {
		super();
		this.value = storeItem;
	}
};
import { EventBase } from './EventBase';

export class NotificationEvent extends EventBase {
	constructor(storeItem) {
		super();
		this.value = storeItem;
	}
};
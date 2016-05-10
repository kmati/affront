// The subscription binds a key to multiple subscribers that wish to be notified
// whenever the store item matching the key changes in the store
export class Subscription {
	constructor(key) {
		this.key = key;
		this.subscribers = [];
	}

	addSubscriber(subscriber) {
		this.subscribers.push(subscriber);
		subscriber.subscription = this;
		return subscriber;
	}

	removeSubscriber(subscriber) {
		const index = this.subscribers.findIndex(f => f === subscriber);
		this.subscribers.splice(index, 1);
		subscriber.subscription = null;
		return subscriber;
	}

	notify(storeItem) {
		this.subscribers.forEach(s => s.notify(storeItem));
	}
};
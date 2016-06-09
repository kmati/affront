// The subscription binds a key to multiple subscribers that wish to be notified
// whenever the store item matching the key changes in the store
export class Subscription {
	// The constructor of a subscription
	// key: The key of store items to listen to notifications for
	constructor(key) {
		this.key = key;
		this.subscribers = [];
	}

	// Adds a subscriber to the subscription
	// subscriber: A subscriber (see Subscriber.js for details)
	addSubscriber(subscriber) {
		// add the subscriber instance to the subscribers Array property
		this.subscribers.push(subscriber);

		// set the subscription of the subscriber instance to this subscription
		subscriber.subscription = this;
		return subscriber;
	}

	// Removes a subscriber from the subscription
	// subscriber: A subscriber (see Subscriber.js for details)
	removeSubscriber(subscriber) {
		// remove the subscriber instance from the subscribers Array property
		const index = this.subscribers.findIndex(f => f === subscriber);
		this.subscribers.splice(index, 1);

		// unset the subscription of the subscriber instance
		subscriber.subscription = null;
		return subscriber;
	}

	// Notifies all the subscribers by sending a store item and notification options to them
	// storeItem: A store item
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	notify(storeItem, notificationOptions) {
		this.subscribers.forEach(s => s.notify(storeItem, notificationOptions));
	}
};
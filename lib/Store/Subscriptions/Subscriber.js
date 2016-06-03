// The Subscriber encapsulates a method or function that subscribes for notifications
export class Subscriber {
	// context: The object that owns the method
	// fn: The method or function to be invoked for the notifications
	constructor(context, fn) {
		this.context = context;
		this.fn = fn;
		this.subscription = null;
	}

	// Unsubscribes from receiving notifications
	unsubscribe() {
		this.subscription.removeSubscriber(this);
	}

	// Calls the method or function with the store item
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	notify(storeItem, notificationOptions) {
		if (this.context) {
			this.fn.call(this.context, storeItem, notificationOptions);
		} else {
			this.fn(storeItem, notificationOptions);
		}
	}
};
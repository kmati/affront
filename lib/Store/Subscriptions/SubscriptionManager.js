import { Subscription } from './Subscription';

// The central manager for all subscriptions and subscribers
// Handles: subscribing and notification
export class SubscriptionManager {
	// The default constructor of a subscription manager
	constructor() {
		this.subscriptions = {};
	}

	// Gets a subscription
	// key: The key of the store item that the subscription is for
	// Returns: The subscription if found, else undefined
	getSubscription(key) {
		const subscription = this.subscriptions[key];
		if (!subscription) {
			this.subscriptions[key] = new Subscription(key);
			return this.subscriptions[key];
		}
		return subscription;
	}

	// Notifies the subscribed listeners who are listening for notifications for the store item
	// storeItem: The store item
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	notify(storeItem, notificationOptions) {
		const subscription = this.subscriptions[storeItem.key];
		if (subscription) {
			subscription.notify(storeItem, notificationOptions);
		}
	}
};
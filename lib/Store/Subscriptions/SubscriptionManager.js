import { Subscription } from './Subscription';

// The central manager for all subscriptions and subscribers
// Handles: subscribing and notification
export class SubscriptionManager {
	constructor() {
		this.subscriptions = {};
	}

	getSubscription(key) {
		const subscription = this.subscriptions[key];
		if (!subscription) {
			this.subscriptions[key] = new Subscription(key);
			return this.subscriptions[key];
		}
		return subscription;
	}

	notify(storeItem) {
		const subscription = this.subscriptions[storeItem.key];
		if (subscription) {
			subscription.notify(storeItem);
		}
	}
};
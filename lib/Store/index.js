/*
 * The store must:
 * 0. Be a proxy of the data on the server
 	* 1. use immutable objects (maybe use immutable.js)
 	* 2. be able to rewind state (perhaps version each change in the state so it can (like a stack) be rewound)
 	* 3. be able to have subscribe
 	* 4. be able to notify on state change
 * 5. be able to bind reducer functions | fn (oldStateId) -> newState
 *		It will take the results of the reducer functions and set the state based on oldStateId (if found)
 *		OR create a new state at oldStateId (if oldStateId is not found)
 *
 * 6. be able to have Http methods as built-in reducer functions (see #5 above)
 */
import { Map, List } from 'immutable';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import { Subscriptions } from './Subscriptions';
import { StoreItem } from './StoreItem';

const httpRequester = {
	get(url, callback) {
		this.request('GET', null, callback);
	},

	post(url, data, callback) {
		this.request('POST', data, callback);
	},

	put(url, data, callback) {
		this.request('PUT', data, callback);
	},

	delete(url, callback) {
		this.request('DELETE', null, callback);
	},

	patch(url, data, callback) {
		this.request('PATCH', data, callback);
	},

	// callback: function (err, response)
	//	where response is an object if JSON.parseable or is the responseText
	request(method, url, data, callback) {
		if (data === null || data === undefined) {
			data = undefined;
		} else if (typeof data === 'object') {
			data = JSON.stringify(data);
		}
		const request = new XMLHttpRequest();
		request.open(method.toUpperCase(), url, true);
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				try {
					callback(null, JSON.parse(request.responseText));
				} catch (e) {
					callback(null, request.responseText);
				}
			} else {
				callback(request.responseText);
			}
		};

		request.onerror = function() {
			callback('Failed to contact remote server');
		};

		if (data) {
			request.send(data);
		} else {
			request.send();
		}
	}
};


class Storage {
	constructor() {
		this.versions = new List();
		this._preserveHistory = false;
		this.subscriptionManager = new Subscriptions.SubscriptionManager();
	}

	get preserveHistory() {
		return this._preserveHistory;
	}

	// If store.preserveHistory is set to true then version history of the store will be preserved;
	//	i.e. each state change in the store will create a new version
	set preserveHistory(value) {
		this._preserveHistory = value;
	}

	// Gets all store items in the store at a given version
	getItems(version) {
		if (version !== undefined) {
			if (typeof version !== 'number') {
				throw new InvalidArgumentError('Store.getItem::version argument must be a number');
			}
			if (version < 0) {
				throw new InvalidArgumentError('Store.getItem::version argument must be a positive number');
			}
		}
		if (this.versions.isEmpty()) {
			return null;
		}
		let currentVersion;
		if (version !== undefined && version < this.versions.size) {
			currentVersion = this.versions.get(version);
		} else {
			currentVersion = this.versions.last();
		}
		return currentVersion.data.toJS();
	}


	// Gets a store item in the store at a given version (or at the latest version if version is null or undefined)
	// Call syntax:
	// - store.getItem(key, version) => StoreItem
	// - store.getItem(key) => StoreItem
	getItem(key, version) {
		if (version !== undefined && version !== null) {
			if (typeof version !== 'number') {
				throw new InvalidArgumentError('Store.getItem::version argument must be a number');
			}
			if (version < 0) {
				throw new InvalidArgumentError('Store.getItem::version argument must be a positive number');
			}
		}
		if (this.versions.isEmpty()) {
			return null;
		}
		let currentVersion;
		if (version !== undefined && version < this.versions.size) {
			currentVersion = this.versions.get(version);
		} else {
			currentVersion = this.versions.last();
		}
		if (!currentVersion.data.has(key)) {
			return null;
		}
		return currentVersion.data.get(key);
	}

	// Note: The first version will be version 0!
	setItem(key, value) {
		let currentVersion;
		if (this.versions.isEmpty()) {
			this.versions = this.versions.push({
				version: 0, // first version is version 0
				data: new Map()
			});
		} else if (this._preserveHistory) {
			const lastVersionData = this.versions.last().data;
			const lastVersion = this.versions.last().version;
			this.versions = this.versions.push({
				version: lastVersion + 1,
				data: lastVersionData
			});

		}
		currentVersion = this.versions.last();

		let item = new StoreItem(key, value);
		currentVersion.data = currentVersion.data.set(key, item);
		this.subscriptionManager.notify(item);
		return item;
	}

	// Subscribes to get called whenever the state changes at a given key in the store
	// key: The key to listen for state changes on
	// context: The object that owns the function to invoke
	// fn: The function to invoke whose signature is: void function (StoreItem)
	// Returns: A subscriber instance
	// Remarks:
	// 1. This method can be called in the following 2 ways:
	// - subscribe(key, context, fn)
	// - subscribe(key, fn)
	// 2. To unsubscribe, call: subscriberInstance.unsubscribe()
	subscribe(key, context, fn) {
		if (typeof context === 'function') {
			fn = context;
			context = null;
		}

		const subscription = this.subscriptionManager.getSubscription(key);
		return subscription.addSubscriber(new Subscriptions.Subscriber(context, fn));
	}
}

export const Store = new Storage();
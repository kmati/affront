/*
 * The store for state data
 */
import { Map, List } from 'immutable';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';
import { Subscriptions } from './Subscriptions';
import { StoreItem } from './StoreItem';

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
	// key: The key for the store item to get
	// version: The version number at which to get the store item
	// Returns: The store item if found, else null
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
		if (version !== undefined && version !== null && version < this.versions.size) {
			currentVersion = this.versions.get(version);
		} else {
			currentVersion = this.versions.last();
		}
		if (!currentVersion.data.has(key)) {
			return null;
		}
		return currentVersion.data.get(key);
	}

	// key: The key to find in the matching version
	// fn: The predicate to match on for a storeItem whose call signature is: function (StoreItem) => boolean
	// Returns: The latest matching version number if found, else -1
	findLatestMatchingVersionNumber(key, fn) {
		for (let verNum = this.versions.size - 1; verNum >= 0; verNum--) {
			let version = this.versions.get(verNum);
			if (version.data.has(key)) {
				let storeItem = version.data.get(key);
				if (fn(storeItem)) {
					return verNum;
				}
			}
		}
		return -1;
	}

	// Removes the versions that are AFTER the specified version number
	// and then sends out the notifications of the version
	// version: the version number of the version to rewind to
	// Returns: An array of the exluded versions (e.g. [ver-6-obj, ver-7-obj, ..., ver-N-obj])
	rewindToVersion(version) {
		if (version === undefined || version === null || typeof version !== 'number') {
			throw new InvalidArgumentError('Store.rewindToVersion::version argument must be a number');
		}
		if (version < 0) {
			throw new InvalidArgumentError('Store.rewindToVersion::version argument must be a positive number');
		}
		if (version >= this.versions.size) {
			throw new InvalidArgumentError('Store.rewindToVersion::version argument must be less than the size of the versions list');
		}
		if (this.versions.isEmpty()) {
			return;
		}

		let excludedVersions = [];
		for (let c = version + 1; c < this.versions.size; c++) {
			excludedVersions.push(this.versions.get(c));
		}

		// truncate the versions that are higher/after the specified version number
		this.versions = this.versions.setSize(version + 1);

		// get the actual version instance
		let currentVersion = this.versions.get(version);

		// now send the notifications for all the store items in the version
		for (const storeItem of currentVersion.data.valueSeq()) {
			this.subscriptionManager.notify(storeItem, {});
		}

		return excludedVersions;
	}

	// Sends out the notifications for all the store items for the current (i.e. latest) version
	// notificationOptions: An object with options in the properties:
	//	e.g. { isRouting: true }
	sendNotificationsForCurrentVersion(notificationOptions) {
		const currentVersion = this.versions.last();

		// now send the notifications for all the store items in the version
		for (const storeItem of currentVersion.data.valueSeq()) {
			this.subscriptionManager.notify(storeItem, notificationOptions);
		}
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
		this.subscriptionManager.notify(item, {});

		this.router.onSetItem(item);
		return item;
	}

	// Note: The first version will be version 0!
	// Note: This method will forcibly create a new version since it IGNORES this._preserveHistory!!!
	setItemAtNextVersion(key, value) {
		let currentVersion;
		if (this.versions.isEmpty()) {
			this.versions = this.versions.push({
				version: 0, // first version is version 0
				data: new Map()
			});
		} else {
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
		this.subscriptionManager.notify(item, {});

		this.router.onSetItem(item);
		return item;
	}

	appendVersion(version) {
		this.versions = this.versions.push(version);
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
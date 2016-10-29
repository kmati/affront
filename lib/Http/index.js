/*
 * The Http requester
 */
import { Store } from '../Store';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';


/*******************
 * Request function
 */

// callback: function (err, response)
//	where response is an object if JSON.parseable or is the responseText
// headers: An object whose keys are HTTP request header names and
//	whose values are the values of the respective HTTP request headers
function request(method, url, data, callback, headers) {
	if (data === null || data === undefined) {
		data = undefined;
	} else if (typeof data === 'object') {
		data = JSON.stringify(data);
	}
	const request = new XMLHttpRequest();
	request.open(method.toUpperCase(), url, true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	if (headers) {
		for (let key in headers) {
			request.setRequestHeader(key, headers[key]);
		}
	}

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			let retVal;
			try {
				retVal = JSON.parse(request.responseText);
			} catch (e) {
				retVal = request.responseText;
			}
			callback(null, retVal);
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


/*******************
 * _baseUri
 */

// the default base uri
let _baseUri = '';

// apply the base uri for relative urls
// url: An url
// Returns: The resolved url if the original url is relative;
//	if the original url is absolute then it is returned as is
function applyBaseUri(url) {
	if (url.substr(0, 7).toLowerCase() === 'http://' ||
		url.substr(0, 8).toLowerCase() === 'https://') {
		// since url is absolute we do NOT apply the base uri!
		return url;
	}
	return _baseUri + url;
}


/*******************
 * _minimumKeyedRequestThreshold (and client-side caching of requests)
 *
 * You can turn on throttling of keyed requests (for the same method and url) by setting the _minimumKeyedRequestThreshold
 * to a number greater than 0. Any other value will turn off throttling. When throttling is on then the subsequent requests
 * within the threshold will have the data served up from the Store (as opposed to making the actual request).
 */

// If _minimumKeyedRequestThreshold is null or undefined:
// No throttling occurs. All requests are issued.
//
// If _minimumKeyedRequestThreshold is a number (in milliseconds):
// _minimumKeyedRequestThreshold is the minimum amount of time that must elapse before a new request
// can be sent with the same method to the same url for a keyed request. This is used for throttling
// in the cases where multiple requesters share the exact same request (i.e. same method and url). With
// the throttling, you can avoid making multiple requests needlessly, while keeping the code of the
// requesters oblivious and naive. The idea is simple: When the first request is issued, the request goes
// through and the result is stored in the Store. When the next request comes in within the
// _minimumKeyedRequestThreshold then the result is automatically got from the Store (rather than the
// request actually being made). Once the _minimumKeyedRequestThreshold has elapsed then the next request
// will actually be made. At no point is the item in the Store removed; that is left up to the users of
// the store item.
let _minimumKeyedRequestThreshold = null;

// Gets whether or not the minimum keyed request threshold is being used
function uses_minimumKeyedRequestThreshold() {
	return typeof _minimumKeyedRequestThreshold === 'number' && _minimumKeyedRequestThreshold > 0;
}

// Only used for GET requests!
// Checks to see if we're still in the threshold for the key;
// If yes then gets the store item from the Store and sends the notifications out
// If no returns { isWithinThreshold: false } so the request can proceed
function handleBeforeRequestThresholdCheck(key, callback) {
	if (uses_minimumKeyedRequestThreshold()) {
		const mkrtStoreItem = Store.getItem(`mkrt_${key}`);
		if (mkrtStoreItem) {
			const deltaMillisecs = new Date().getTime() - mkrtStoreItem.value.createdAt;
			if (deltaMillisecs < _minimumKeyedRequestThreshold) {
				const foundStoreItem = Store.getItem(key);
				if (foundStoreItem) {
					Store.sendNotificationForStoreItem(foundStoreItem);
					callback(null, foundStoreItem.value);
					return { isWithinThreshold: true };
				}
			}
		}
	}

	return { isWithinThreshold: false };
}

// Used after requests of any HTTP Method!
// Sets the threshold related information into the Store for the key
function handleAfterRequestThreshold(key, storeItem) {
	if (uses_minimumKeyedRequestThreshold()) {
		Store.setItem(`mkrt_${key}`, { createdAt: new Date().getTime(), storeItem: storeItem });
	}
}


/*******************
 * Http
 */

export const Http = {
	// Gets the base uri
	get BaseUri() {
		return _baseUri;
	},

	// Sets the base uri
	set BaseUri(val) {
		if (typeof val !== 'string') {
			throw new InvalidArgumentError('Cannot set the BaseUri because the value passed in is not a string');
		}
		_baseUri = val;
	},

	// Gets the minimum keyed request threshold
	get MinimumKeyedRequestThreshold() {
		return _minimumKeyedRequestThreshold;
	},

	// Sets the minimum keyed request threshold
	set MinimumKeyedRequestThreshold(milliseconds) {
		_minimumKeyedRequestThreshold = milliseconds;
	},

	// Gets whether or not the minimum keyed request threshold is being used
	get usesMinimumKeyedRequestThreshold() {
		return uses_minimumKeyedRequestThreshold();
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// callback: void function (err, responseData)
	// headers: An object whose keys are HTTP request header names and
	//	whose values are the values of the respective HTTP request headers
	get(key, url, callback, headers) {
		if (handleBeforeRequestThresholdCheck(key, callback).isWithinThreshold) {
			// we got the store item from Store and don't need to query for it
			// since we're still within the threshold!
			return;
		}

		if (!url) {
			callback(new InvalidArgumentError('Cannot GET: No url passed in'));
			return;
		}
		request('GET', applyBaseUri(url), null, (err, value) => {
			if (err) {
				callback(err);
				return;
			}
			if (key) {
				const storeItem = Store.setItem(key, value);
				handleAfterRequestThreshold(key, storeItem);
			}
			callback(null, value);
		}, headers);
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// data: The data to post
	// callback: void function (err, responseData)
	// headers: An object whose keys are HTTP request header names and
	//	whose values are the values of the respective HTTP request headers
	post(key, url, data, callback, headers) {
		if (!url) {
			callback(new InvalidArgumentError('Cannot POST: No url passed in'));
			return;
		}
		request('POST', applyBaseUri(url), data, (err, value) => {
			if (err) {
				callback(err);
				return;
			}
			if (key) {
				const storeItem = Store.setItem(key, value);
				handleAfterRequestThreshold(key, storeItem);
			}
			callback(null, value);
		}, headers);
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// data: The data to put
	// callback: void function (err, responseData)
	// headers: An object whose keys are HTTP request header names and
	//	whose values are the values of the respective HTTP request headers
	put(key, url, data, callback, headers) {
		if (!url) {
			callback(new InvalidArgumentError('Cannot PUT: No url passed in'));
			return;
		}
		request('PUT', applyBaseUri(url), data, (err, value) => {
			if (err) {
				callback(err);
				return;
			}
			if (key) {
				const storeItem = Store.setItem(key, value);
				handleAfterRequestThreshold(key, storeItem);
			}
			callback(null, value);
		}, headers);
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// callback: void function (err, responseData)
	// headers: An object whose keys are HTTP request header names and
	//	whose values are the values of the respective HTTP request headers
	delete(key, url, callback, headers) {
		if (!url) {
			callback(new InvalidArgumentError('Cannot DELETE: No url passed in'));
			return;
		}
		request('DELETE', applyBaseUri(url), null, (err, value) => {
			if (err) {
				callback(err);
				return;
			}
			if (key) {
				const storeItem = Store.setItem(key, value);
				handleAfterRequestThreshold(key, storeItem);
			}
			callback(null, value);
		}, headers);
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// data: The data to patch
	// callback: void function (err, responseData)
	// headers: An object whose keys are HTTP request header names and
	//	whose values are the values of the respective HTTP request headers
	patch(key, url, data, callback, headers) {
		if (!url) {
			callback(new InvalidArgumentError('Cannot PATCH: No url passed in'));
			return;
		}
		request('PATCH', applyBaseUri(url), data, (err, value) => {
			if (err) {
				callback(err);
				return;
			}
			if (key) {
				const storeItem = Store.setItem(key, value);
				handleAfterRequestThreshold(key, storeItem);
			}
			callback(null, value);
		}, headers);
	}
};
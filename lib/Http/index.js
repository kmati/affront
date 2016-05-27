/*
 * The Http requester
 */
import { Store } from '../Store';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';

// callback: function (err, response)
//	where response is an object if JSON.parseable or is the responseText
function request(method, url, data, callback) {
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

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// callback: void function (err, responseData)
	get(key, url, callback) {
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
				Store.setItem(key, value);
			}
			callback(null, value);
		});
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// data: The data to post
	// callback: void function (err, responseData)
	post(key, url, data, callback) {
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
				Store.setItem(key, value);
			}
			callback(null, value);
		});
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// data: The data to put
	// callback: void function (err, responseData)
	put(key, url, data, callback) {
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
				Store.setItem(key, value);
			}
			callback(null, value);
		});
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// callback: void function (err, responseData)
	delete(key, url, callback) {
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
				Store.setItem(key, value);
			}
			callback(null, value);
		});
	},

	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// data: The data to patch
	// callback: void function (err, responseData)
	patch(key, url, data, callback) {
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
				Store.setItem(key, value);
			}
			callback(null, value);
		});
	}
};
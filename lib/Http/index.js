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

let _baseUri = '';

function applyBaseUri(url) {
	return _baseUri + url;
}

export const Http = {
	get BaseUri() {
		return _baseUri;
	},

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
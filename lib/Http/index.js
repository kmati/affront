/*
 * The Http requester
 */
import { Store } from '../Store';

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


export const Http = {
	// key: The key of the store item to set with the response data
	// 	If key is set then the matching store item will be set
	// url: The url
	// callback: void function (err, responseData)
	get(key, url, callback) {
		request('GET', null, (err, value) => {
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
		request('POST', data, (err, value) => {
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
		request('PUT', data, (err, value) => {
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
		request('DELETE', null, (err, value) => {
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
		request('PATCH', data, (err, value) => {
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
"use strict";
/*
 * This module exports the middleware factory which will create the ExpressJS middleware that is used to
 * provide the server-side routing that corresponds to the client-side routing for Affront.
 */

const fs = require('fs'),
	path = require('path');

function findDefaultPage(staticFilesDir) {
	if (fs.existsSync(path.join(staticFilesDir, 'index.html'))) {
		return 'index.html';
	}
	if (fs.existsSync(path.join(staticFilesDir, 'index.htm'))) {
		return 'index.htm';
	}
	throw new Error(`Cannot find the default page file in ${staticFilesDir}`);
}

module.exports = {
	// staticFilesDir: The full path to the static files directory
	// pageFile: [defaults to 'index.html'] The name of the file that contains the initial page content (e.g. 'index.html')
	// contentType: [defaults to 'text/html'] The content type of the initial page content
	// Returns: An ExpressJS middleware function
	create: function (staticFilesDir, pageFile, contentType) {
		contentType = contentType || 'text/html';
		if (!pageFile) {
			pageFile = findDefaultPage(staticFilesDir);
		}

		return function (req, res, next) {
			fs.exists(path.join(staticFilesDir + req.originalUrl), exists => {
				if (exists) {
					next();
					return;
				}

				fs.readFile(path.join(staticFilesDir, pageFile), (err, buf) => {
					if (err) {
						console.error(err);
						return;
					}

					res.set('Content-Type', contentType);
					res.send(buf);
					next();
				});
			});
		};
	}
};
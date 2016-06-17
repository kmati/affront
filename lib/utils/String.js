"use strict";
/*
 * String extensions
 */

// Replaces all occurrences of a match within a prefix and suffix in the string
// e.g.
// let str = '<foo class="atom molecule quark"></foo><bar class="molecule"/>';
// let result = str.replaceWithin('class="', '"', 'molecule', [' ', '"', '\''], 'water');
// assert.equal('<foo class="atom water quark"></foo><bar class="water"/>', result); // 'molecule' replaced with 'water'
//
// Assumes:
// 1. The match is followed only by the specified match next chars array
String.prototype.replaceWithin = function (prefix, suffix, match, matchNextChars, replacement) {
	let str = this;
	let oldI = -1;
	while (true) {
		const locPrefix = str.indexOf(prefix, oldI + 1);
		if (locPrefix === -1) break;

		const locS = locPrefix + prefix.length - 1;
		const locSuffix = str.indexOf(suffix, locS + 1);
		if (locSuffix === -1) break;

		//let piece = str.substr(locS + 1, locSuffix - locS);
		let piece = str.substr(locS, 1 + locSuffix - locS);

		for (let a = 0; a < matchNextChars.length; a++) {
			for (let b = 0; b < matchNextChars.length; b++) {
				const pre = matchNextChars[a],
					post = matchNextChars[b];

				const re = new RegExp(pre + match + post, 'g');
				piece = piece.replace(re, pre + replacement + post);
			}
		}

		//const left = str.substr(0, locS + 1) + piece;
		const left = str.substr(0, locS) + piece;
		str = left + str.substr(locSuffix + 1);

		oldI = left.length + suffix.length - 1;
	}
	return str;
};
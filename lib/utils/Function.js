"use strict";
/*
 * Function extensions
 */

// Gets the constructor name in a way that will work for modern browsers
// as well as IE.
// Must be called using: {instance}.constructor.getConstructorName()
/*
 Example usage:

 function Foo() {}

 const f = new Foo();
 const nameStr = f.constructor.getConstructorName();
*/
Function.prototype.getConstructorName = function() {
    // try and get the constructor name using the modern mechanism
    const defaultName = this.name;
    if (defaultName) return defaultName;

    // fallback to the ancient way
    const M = this.toString().match(/function\s+([\w\$]+)\s*\(/) || '';
    return M ? M[1] : '';
};
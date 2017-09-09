/**
 * Author: Peter Dragicevic [peter@petschko.org]
 * Authors-Website: http://petschko.org/
 * Date: 04.04.2017
 * Time: 20:23
 */

/**
 * Creates a new ErrorException
 *
 * @param {string} message - Exception-Message
 * @param {int|undefined|null} code - Exception-Error-Code
 * @constructor - ErrorException
 */
function ErrorException(message, code) {
	if(code === undefined || code === null || isNaN(code))
		code = 0;

	this.name = 'ErrorException';
	this.message = message;
	this.code = code;

	/**
	 * Returns the Exception as String
	 *
	 * @returns {string} - Exception as String
	 */
	this.toString = function() {
		return this.name + ': (Error-Code ' + this.code + ') ' + this.message;
	}
}

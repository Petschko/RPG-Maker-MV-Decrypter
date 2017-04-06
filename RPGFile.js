/**
 * Author: Peter Dragicevic [peter-91@hotmail.de]
 * Authors-Website: http://petschko.org/
 * Date: 01.04.2017
 * Time: 14:37
 */

/**
 * Creates a new instance of the RPGFile Object
 *
 * @param {File} file - File-Object
 * @param {undefined|string|null} blobUrl - Blob-URL if set else null
 * @constructor - RPGFile
 */
function RPGFile(file, blobUrl) {
	if(typeof blobUrl === 'undefined')
		blobUrl = null;

	this.file = file;
	this.fullName = this.file.name;
	this.name = null;
	this.extension = null;
	this.fileUrl = blobUrl;

	/**
	 * Splits the FullName into name & file ext
	 */
	RPGFile.prototype.splitFileName = function() {
		var pointPos = this.fullName.lastIndexOf('.');

		if(pointPos < 1 || (pointPos + 1) === this.fullName.length) {
			this.name = this.fullName;
			return;
		}

		this.extension = this.fullName.substr(pointPos + 1);
		this.name = this.fullName.substr(0, pointPos - 1);
	};
	this.splitFileName();
}

/**
 * Saves the File
 */
RPGFile.prototype.save = function() {
	if(this.fileUrl === null)
		return;

	//todo
};

/**
 * Creates a BLOB-URL from a object
 *
 * @param {ArrayBuffer|Object} object - Object
 * @returns {String} - BLOB-URL of the array buffer
 */
RPGFile.createBlobUrl = function(object) {
	var blob = new Blob([object]);
	return window.URL.createObjectURL(blob);
};
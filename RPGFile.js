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
 * Creates the Output for the File
 *
 * @returns {Element} - Output-Element
 */
RPGFile.prototype.createOutPut = function() {
	var element = document.createElement('div');
	var fileNameEl = document.createElement('span');
	var viewLink = document.createElement('a');
	var saveFunction = document.createElement('a');

	element.className = 'fileInfo';
	fileNameEl.innerHTML = this.name + '.' + this.extension;

	// Set all to view the link
	viewLink.innerHTML = 'View';
	viewLink.title = 'View ' + this.name + '.' + this.extension + ' in your Browser';
	viewLink.href = this.fileUrl;
	viewLink.target = '_blank';

	// Set all to save file
	saveFunction.innerHTML = 'Save';
	saveFunction.className = 'save';
	saveFunction.title = 'Save ' + this.name + '.' + this.extension + ' on your Computer';
	saveFunction.href = this.fileUrl;
	saveFunction.download = this.name + '.' + this.extension;
	saveFunction.target = '_blank';

	// Mix all together^^
	element.appendChild(fileNameEl);
	element.appendChild(viewLink);
	element.appendChild(saveFunction);

	return element;
};

/**
 * Converts the current extension to an other extension
 *
 * @param {boolean} toNormal - Converts the current extension to a normal extension
 */
RPGFile.prototype.convertExtension = function(toNormal) {
	if(toNormal) {
		switch(this.extension.toLocaleLowerCase()) {
			case 'rpgmvp':
				this.extension = 'png';
				break;
			case 'rpgmvm':
				this.extension = 'm4a';
				break;
			case 'rpgmvo':
				this.extension = 'ogg';
		}
	} else {
		switch(this.extension.toLocaleLowerCase()) {
			case 'png':
				this.extension = 'rpgmvp';
				break;
			case 'm4a':
				this.extension = 'rpgmvm';
				break;
			case 'ogg':
				this.extension = 'rpgmvo';
		}
	}
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

/**
 * Author: Peter Dragicevic [peter@petschko.org]
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
	this.blob = null;
	this.fileUrl = blobUrl;
	this.content = null;

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
		this.name = this.fullName.substr(0, pointPos);
	};
	this.splitFileName();

	/**
	 * Shows if the current file has an Encrypted File-Extension
	 *
	 * @returns {boolean} - true if Encrypted File-Extension else false
	 */
	RPGFile.prototype.isEncryptedExt = function() {
		return (this.extension === 'rpgmvp' || this.extension === 'rpgmvm' || this.extension === 'rpgmvo');
	}
}

/**
 * Disposes a RPG-File
 */
RPGFile.prototype.dispose = function() {
	if(this.fileUrl) {
		window.URL.revokeObjectURL(this.fileUrl);
		this.fileUrl = null;
	}
	if(this.blob)
		this.blob = null;

	this.file = null;
	this.fullName = null;
	this.name = null;
	this.extension = null;
	this.content = null;
};

/**
 * Creates the Output for the File
 *
 * @param {string|null} faultMessage - Error-Message or null if all is ok
 * @returns {Element} - Output-Element
 */
RPGFile.prototype.createOutPut = function(faultMessage) {
	var element = document.createElement('div');
	var fileNameEl = document.createElement('span');

	element.className = 'fileInfo';
	fileNameEl.innerHTML = this.name + '.' + this.extension;

	if(! faultMessage) {
		var viewLink;
		if(this.isEncryptedExt())
			viewLink = document.createElement('s');
		else
			viewLink = document.createElement('a');

		var saveFunction = document.createElement('a');

		// Set all to view the link
		viewLink.innerHTML = 'View';
		if(! this.isEncryptedExt()) {
			viewLink.title = 'View ' + this.name + '.' + this.extension + ' in your Browser';
			viewLink.href = this.fileUrl;
			viewLink.target = '_blank';
		} else {
			var toolTipText = document.createElement('div');
			toolTipText.className = 'tooltipText';
			toolTipText.innerHTML = 'This File is encrypted and you can\'t view it in the Browser. ' +
				'You can save it and put it in the game (Translated images for example).';
			viewLink.className = 'grey encryptedFile tooltip';
			viewLink.appendChild(toolTipText);
		}

		// Set all to save file
		saveFunction.innerHTML = 'Save';
		saveFunction.className = 'save';
		saveFunction.title = 'Save ' + this.name + '.' + this.extension + ' on your Computer';
		saveFunction.href = this.fileUrl;
		saveFunction.download = this.name + '.' + this.extension;
		saveFunction.target = '_blank';
	} else {
		var errorEl = document.createElement('span');
		var tooltipError = document.createElement('span');
		errorEl.innerHTML = 'Error';
		errorEl.className = 'tooltip';
		tooltipError.innerHTML = faultMessage;
		tooltipError.className = 'tooltipText longText';
		errorEl.appendChild(tooltipError);

		// Add Error-CSS-Class
		element.className = addCssClass(element.className, 'errorFile');
	}

	// Mix all together^^
	element.appendChild(fileNameEl);
	if(! faultMessage) {
		element.appendChild(viewLink);
		element.appendChild(saveFunction);
	} else
		element.appendChild(errorEl);

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
 * Creates the BLOB-URL for this File
 */
RPGFile.prototype.createBlobUrl = function() {
	this.blob = new Blob([this.content]);
	this.fileUrl = window.URL.createObjectURL(this.blob);
};

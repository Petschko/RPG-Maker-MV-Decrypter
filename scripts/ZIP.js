/**
 * Author: Peter Dragicevic [peter@petschko.org]
 * Authors-Website: http://petschko.org/
 * Date: 14.07.2017
 * Time: 22:06
 */

/**
 * Creates a new ZIP Object
 *
 * @constructor - ZIP
 */
function ZIP() {
	this.files = [];
}

/**
 * Removes all references from the ZIP-Object
 */
ZIP.prototype.dispose = function() {
	for(var i = 0; i < this.files.length; i++) {
		this.files[i].dispose();
	}

	// Remove all Files from the List
	this.files = [];
};

/**
 * Adds a new File to the ZIP-File
 *
 * @param {RPGFile} rpgFile - RPG-File to add
 */
ZIP.prototype.addFile = function(rpgFile) {
	this.files.push(rpgFile);
};

/**
 * Turns all Files into a ZIP-File and Download it
 */
ZIP.prototype.save = function() {
	if(this.files.length < 1)
		return;

	var jsZip = new JSZip();

	// Add all Files to the ZIP
	var addedFiles = 0;
	for(var i = 0; i < this.files.length; i++) {
		if(this.files[i].content !== null) {
			jsZip.file(this.files[i].name + '.' + this.files[i].extension, this.files[i].content);
			addedFiles++;
		}
	}

	// Download ZIP
	if(addedFiles > 0) {
		jsZip.generateAsync({type: 'blob'}).then(function(blob) {
			saveAs(blob, 'RPG-Files.zip');
			blob = null;
		});
	} else
		alert('Can\'t offer ZIP-Download. ZIP would be empty...');
};

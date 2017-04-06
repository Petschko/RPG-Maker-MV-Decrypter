/**
 * Author: Peter Dragicevic [peter-91@hotmail.de]
 * Authors-Website: http://petschko.org/
 * Date: 30.03.2017
 * Time: 23:05
 */

/**
 * Try to Reads the Encryption-Code and insert it to the given input element
 *
 * @param {string} systemFileElId - File-Picker-Id for the System.json-File
 * @param {string} codeTextElId - Text-Input-Id for the Encryption-Key
 */
function getCode(systemFileElId, codeTextElId) {
	var systemFileEl = document.getElementById(systemFileElId);
	var codeTextEl = document.getElementById(codeTextElId);

	if(systemFileEl.files.length < 1) {
		alert('Please choose the System.json-File!');
		return;
	}

	Decrypter.detectEncryptionCode(new RPGFile(systemFileEl.files[0], null), function(key) {
		if(key === null) {
			alert('Error: File-Content was invalid (Was not a JSON-File)');
			return;
		}

		if(typeof key === 'string' && key.length > 0) {
			codeTextEl.value = key;
			codeTextEl.className = removeValidationCssClasses(codeTextEl.className);
			codeTextEl.className = addCssClass(codeTextEl.className, 'valid');
			alert('Key found^^! (' + key + ')');
		} else
			alert('Error: Encryption-Key not found - Make sure that you select the correct file!');
	});
}

/**
 * Removes a CSS-Class
 *
 * @param {string} elementClasses - Element CSS-Classes
 * @param {string} removeClass - Class to remove
 * @returns {string} - New CSS-Classes
 */
function removeCssClass(elementClasses, removeClass) {
	var newClassNames = '';
	var classes = elementClasses.split(' ');

	// Check if element is in array else exit
	if(classes.indexOf(removeClass) === -1)
		return elementClasses;

	for(var i = 0; i < classes.length; i++) {
		if(classes[i] !== removeClass)
			newClassNames += classes[i] + ' ';
	}

	return newClassNames.trim();
}

/**
 * Adds a CSS-Class, it never adds an existing class twice
 *
 * @param {string} elementClasses - Element CSS-Classes
 * @param {string} addClass - Class to add
 * @returns {string} - New CSS-Classes
 */
function addCssClass(elementClasses, addClass) {
	var classes = elementClasses.split(' ');

	if(classes.indexOf(addClass) !== -1)
		return elementClasses;

	return (elementClasses + ' ' + addClass).trim();
}

/**
 * Removes all Validation-Classes
 *
 * @param {string} currentClasses - Current Element CSS-Classes
 * @returns {string} - CSS-Classes without validation ones
 */
function removeValidationCssClasses(currentClasses) {
	currentClasses = removeCssClass(currentClasses, 'invalid');
	currentClasses = removeCssClass(currentClasses, 'manualChange');
	currentClasses = removeCssClass(currentClasses, 'valid');

	return currentClasses;
}

/**
 * Changes the validation class to manualChange
 *
 * @param {string} elementId - Element-Id to where to change
 */
function manualChange(elementId) {
	var element = document.getElementById(elementId);

	element.className = removeValidationCssClasses(element.className);
	element.className = addCssClass(element.className, 'manualChange');
}

/**
 * Adds all Action-Listener
 */
function init() {
	var addMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
	// Get Elements
	var detectButton = document.getElementById('detectButton');
	var inputCode = document.getElementById('decryptCode');

	// Add Listener
	detectButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		getCode('systemFile', 'decryptCode');
	}, false);
	inputCode[addMethod](window.addEventListener ? 'change' : 'onchange', function() {
		manualChange('decryptCode');
	}, false);
}

document.body[window.addEventListener ? 'addEventListener' : 'attachEvent'](
	window.addEventListener ? 'load' : 'onload', init(), false);

/**
 * Decrypt a bunch of MV-Encrypted-Files
 *
 * @param {string} fileUrlElId - Element-Id of the File(s)-Picker
 * @param {string} decryptCodeElId - Element-Id of the Decryption-Code Input Field
 * @param {boolean} verifyHeader - Verify Header
 * @param {string} headerLenElId - Element-Id of the Header-Length
 * @param {string} signatureElId - Element-Id of the Signature
 * @param {string} versionElId - Element-Id of the Version
 * @param {string} remainElId - Element-Id of the Remain
 */
function decryptFiles(
	fileUrlElId,
	decryptCodeElId,
	verifyHeader,
	headerLenElId,
	signatureElId,
	versionElId,
	remainElId
) {
	var fileUrlEl = document.getElementById(fileUrlElId);
	var encryptCodeEl = document.getElementById(decryptCodeElId);
	var encryptionCode = encryptCodeEl.value;
	var headerLen = null;
	var signature = null;
	var version = null;
	var remain = null;

	if(verifyHeader) {
		headerLen = document.getElementById(headerLenElId);
		signature = document.getElementById(signatureElId);
		version = document.getElementById(versionElId);
		remain = document.getElementById(remainElId);
	}

	// Check if all required stuff is given
	if(! encryptionCode) {
		alert('Specify the Decryption-Code!');
		encryptCodeEl.className = removeValidationCssClasses(encryptCodeEl.className);
		encryptCodeEl.className = addCssClass(encryptCodeEl.className, 'invalid');

		return;
	}

	if(fileUrlEl.files.length < 1) {
		alert('Specify at least 1 File to decrypt...');

		return;
	}

	var decrypter = new Decrypter(encryptionCode);
	decrypter.ignoreFakeHeader = ! verifyHeader;
	if(verifyHeader) {

	}

	// --------------------------------
	// Set Code
	Decrypter.plainDecryptionCode = encryptionCode;

	// Process every File
	for(var i = 0; i < fileUrlEl.files.length; i++) {
		var reader = new FileReader();
		console.log('Try to decrypt the File "' + fileUrlEl.files[i].name + '" with Decryption-Code "' + encryptionCode + '"...');

		/**
		 * Decrypt the File if its loaded
		 */
		reader.addEventListener("load", function() {
			var fileUrl = Decrypter.createBlobUrl(this.result);
			console.log('File read and loaded into "' + fileUrl + '".');

			// Decrypt Image
			Decrypter.decrypt(fileUrl);
			console.log('File decrypted with the given Key - Wrong keys will not give the expected output!');
		}, false);

		// Read File
		console.log('Try to read the File...');
		reader.readAsArrayBuffer(fileUrlEl.files[i]);
	}
}

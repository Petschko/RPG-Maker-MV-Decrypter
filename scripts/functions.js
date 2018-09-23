/**
 * Author: Peter Dragicevic [peter@petschko.org]
 * Authors-Website: http://petschko.org/
 * Date: 30.03.2017
 * Time: 23:05
 */

// Globals
var zip;

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
			alert(
				'Error: Encryption-Key not found - Make sure that you select the correct file!\n\n' +
				'In rare cases the Key is hidden in this File: ./www/js/rpg_core(.js)\n\n' +
				'Please try to select the rpg_core(.js) file and try again (if not already done)!'
			);
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
 * Check if a the searched Class is within this class-string
 *
 * @param {string} elementClasses - Element CSS-Classes
 * @param {string} searchClass - Class to check
 * @returns {boolean} - true if the class exist else false
 */
function hasCssClass(elementClasses, searchClass) {
	var classes = elementClasses.split(' ');

	return (classes.indexOf(searchClass) !== -1);
}

/**
 * Get the Value of a Radio-Button-Group
 *
 * @param {string} radioButtonGroupName - Radio-Button-Group-Name
 * @param {string} fallback - Fallback-Value
 * @returns {string} - Current Value or Fallback-Value if group doesn't exists or nothing is selected
 */
function getRadioButtonValue(radioButtonGroupName, fallback) {
	var radioButtons = document.getElementsByName(radioButtonGroupName);
	var currentValue = fallback;

	for(var i = 0; i < radioButtons.length; i++) {
		if(radioButtons[i].checked) {
			currentValue = radioButtons[i].value;
			break;
		}
	}

	return currentValue;
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
 * Shows/Hides a Spoiler-Element
 *
 * @param {string} spoilerTextElId - Element-Id of the Spoiler-Text
 * @param {string} spoilerText - Text of the Spoiler-Text-Element (without show/hide)
 * @param {string} spoilerElId - Spoiler-Element-Id
 */
function spoiler(spoilerTextElId, spoilerText, spoilerElId) {
	var spoilerTextEl = document.getElementById(spoilerTextElId);
	var spoilerEl = document.getElementById(spoilerElId);

	if(hasCssClass(spoilerEl.className, 'hidden')) {
		spoilerEl.className = removeCssClass(spoilerEl.className, 'hidden');
		spoilerTextEl.innerHTML = spoilerText + ' (Hide)';
	} else {
		spoilerEl.className = addCssClass(spoilerEl.className, 'hidden');
		spoilerTextEl.innerHTML = spoilerText + ' (Show)';
	}
}

/**
 * Adds all Action-Listener
 */
function init() {
	var addMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';

	// Get Elements
	var detectButton = document.getElementById('detectButton');
	var inputCode = document.getElementById('decryptCode');
	var decryptButton = document.getElementById('decrypt');
	var encryptButton = document.getElementById('encrypt');
	var spoilerBrowserSup = document.getElementById('browserSpoilerText');
	var spoilerHeader = document.getElementById('spoilerHeaderInfoText');
	var headerRadioButtons = document.getElementsByName('checkFakeHeader');
	var headerAreaEl = document.getElementById('headerValuesEditArea');
	var headerResetButton = document.getElementById('resetHeader');
	var zipSaveButton = document.getElementById('zipSave');
	var clearFileListButton = document.getElementById('clearFileList');

	// Prepare stuff
	if(! parseInt(getRadioButtonValue('checkFakeHeader', '1')))
		headerAreaEl.className = addCssClass(headerAreaEl.className, 'hidden');
	setHeaderDefaultValues(false);

	// Add Listener
	headerRadioButtons[0][addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		// Yes Button
		headerAreaEl.className = removeCssClass(headerAreaEl.className, 'hidden');
	}, false);
	headerRadioButtons[1][addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		// No Button
		headerAreaEl.className = addCssClass(headerAreaEl.className, 'hidden');
	}, false);
	headerResetButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		setHeaderDefaultValues(true);
	}, false);
	spoilerBrowserSup[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		spoiler('browserSpoilerText', '', 'browserSupportArea');
	}, false);
	spoilerHeader[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		spoiler('spoilerHeaderInfoText', 'Header-Values', 'headerInfo');
	}, false);
	detectButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		getCode('systemFile', 'decryptCode');
	}, false);
	decryptButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		processFiles(
			'encryptedImg',
			'decryptCode',
			'blob',
			true,
			!! parseInt(getRadioButtonValue('checkFakeHeader', '0')),
			'headerLen',
			'signature',
			'version',
			'remain'
		);
	}, false);
	encryptButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		processFiles(
			'encryptedImg',
			'decryptCode',
			'blob',
			false,
			true,
			'headerLen',
			'signature',
			'version',
			'remain'
		);
	}, false);
	inputCode[addMethod](window.addEventListener ? 'change' : 'onchange', function() {
		manualChange('decryptCode');
	}, false);
	zipSaveButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		saveZip();
	}, false);
	clearFileListButton[addMethod](window.addEventListener ? 'click' : 'onclick', function() {
		clearFileList('blob', 'zipSave');
		this.disabled = 'disabled';
	}, false);

	zip = new ZIP();
}

document.body[window.addEventListener ? 'addEventListener' : 'attachEvent'](
	window.addEventListener ? 'load' : 'onload', init(), false);

/**
 * Set all Values to default within the Header-Values-Area
 *
 * @param {boolean} confirmDialog - Ask before reset
 */
function setHeaderDefaultValues(confirmDialog) {
	if(confirmDialog) {
		if(! confirm('Are you sure to reset the Header-Values to default?'))
			return;
	}

	// Get all Elements
	var headerLenEl = document.getElementById('headerLen');
	var headerSigEl = document.getElementById('signature');
	var headerVerEl = document.getElementById('version');
	var headerRemainEl = document.getElementById('remain');

	// Get a dummy Decrypter Class
	var decrypter = new Decrypter('000000');

	// Set Values
	headerLenEl.value = decrypter.defaultHeaderLen;
	headerLenEl.placeholder = decrypter.defaultHeaderLen;
	headerSigEl.value = decrypter.defaultSignature;
	headerSigEl.placeholder = decrypter.defaultSignature;
	headerVerEl.value = decrypter.defaultVersion;
	headerVerEl.placeholder = decrypter.defaultVersion;
	headerRemainEl.value = decrypter.defaultRemain;
	headerRemainEl.placeholder = decrypter.defaultRemain;
}

/**
 * Decrypt a bunch of MV-Encrypted-Files
 *
 * @param {string} fileUrlElId - Element-Id of the File(s)-Picker
 * @param {string} decryptCodeElId - Element-Id of the Decryption-Code Input Field
 * @param {string} outputElId - Output-Element-Id
 * @param {boolean} decrypt - Decrypt (true decrypts false encrypts)
 * @param {boolean} verifyHeader - Verify Header
 * @param {string} headerLenElId - Element-Id of the Header-Length
 * @param {string} signatureElId - Element-Id of the Signature
 * @param {string} versionElId - Element-Id of the Version
 * @param {string} remainElId - Element-Id of the Remain
 */
function processFiles(
	fileUrlElId,
	decryptCodeElId,
	outputElId,
	decrypt,
	verifyHeader,
	headerLenElId,
	signatureElId,
	versionElId,
	remainElId
) {
	var outputEl = document.getElementById(outputElId);
	var fileUrlEl = document.getElementById(fileUrlElId);
	var encryptCodeEl = document.getElementById(decryptCodeElId);
	var encryptionCode = encryptCodeEl.value;
	var headerLen = null;
	var signature = null;
	var version = null;
	var remain = null;

	// On encryption verify-header is req
	if(! decrypt)
		verifyHeader = true;

	if(verifyHeader) {
		var headerLenEl = document.getElementById(headerLenElId);
		var signatureEl = document.getElementById(signatureElId);
		var versionEl = document.getElementById(versionElId);
		var remainEl = document.getElementById(remainElId);

		if(headerLenEl)
			headerLen = headerLenEl.value;
		if(signatureEl)
			signature = signatureEl.value;
		if(versionEl)
			version = versionEl.value;
		if(remainEl)
			remain = remainEl.value;
	}

	// Check if all required stuff is given
	if(! encryptionCode) {
		alert('Specify the En/Decryption-Code!');
		encryptCodeEl.className = removeValidationCssClasses(encryptCodeEl.className);
		encryptCodeEl.className = addCssClass(encryptCodeEl.className, 'invalid');

		return;
	}

	// Check if code just contain HEX-Chars
	if(! Decrypter.checkHexChars(encryptionCode)) {
		alert('En/Decryption-Code can just contain HEX-Chars (0-9 & A-F or a-f)!');
		encryptCodeEl.className = removeValidationCssClasses(encryptCodeEl.className);
		encryptCodeEl.className = addCssClass(encryptCodeEl.className, 'invalid');

		return;
	}

	// Set valid encryption class
	encryptCodeEl.className = removeValidationCssClasses(encryptCodeEl.className);
	encryptCodeEl.className = addCssClass(encryptCodeEl.className, 'valid');

	// Check if at least 1 File is given
	if(fileUrlEl.files.length < 1) {
		alert('Specify at least 1 File to decrypt...');

		return;
	}

	var decrypter = new Decrypter(encryptionCode);
	decrypter.ignoreFakeHeader = ! verifyHeader;
	if(verifyHeader) {
		// Handle Header details
		headerLenEl.className = removeValidationCssClasses(headerLenEl.className);
		if(! isNaN(headerLen) && Math.floor(headerLen) > 0)
			decrypter.headerLen = Math.floor(headerLen);
		else if(headerLen) {
			headerLenEl.className = addCssClass(headerLenEl.className, 'invalid');
			alert('Info: Header-Length must be a positive round Number! (Using default now: ' +
				decrypter.defaultHeaderLen + ')');
		}

		signatureEl.className = removeValidationCssClasses(signatureEl.className);
		if(Decrypter.checkHexChars(signature))
			decrypter.signature = signature;
		else if(signature) {
			signatureEl.className = addCssClass(signatureEl.className, 'invalid');
			alert('Info: Header-Signature can just contain HEX-Chars (0-9 & A-F or a-f)! (Using default now: ' +
				decrypter.defaultSignature + ')');
		}

		versionEl.className = removeValidationCssClasses(versionEl.className);
		if(Decrypter.checkHexChars(version))
			decrypter.version = version;
		else if(version) {
			versionEl.className = addCssClass(versionEl.className, 'invalid');
			alert('Info: Header-Version can just contain HEX-Chars (0-9 & A-F or a-f)! (Using default now: ' +
				decrypter.defaultVersion + ')');
		}

		remainEl.className = removeValidationCssClasses(remainEl.className);
		if(Decrypter.checkHexChars(remain))
			decrypter.remain = remain;
		else if(remain) {
			remainEl.className = addCssClass(remainEl.className, 'invalid');
			alert('Info: Header-Remain can just contain HEX-Chars (0-9 & A-F or a-f)! (Using default now: ' +
				decrypter.defaultRemain + ')');
		}
	}

	// Process all Files
	var buttonsEnabled = false; // Just trigger that event one time this loop
	for(var i = 0; i < fileUrlEl.files.length; i++) {
		var rpgFile = new RPGFile(fileUrlEl.files[i], null);

		if(decrypt) {
			decrypter.decryptFile(rpgFile, function(rpgFile, exception) {
				// Output Decrypted file
				if(exception !== null)
					outputEl.appendChild(rpgFile.createOutPut(exception.toString()));
				else {
					rpgFile.convertExtension(true);
					outputEl.appendChild(rpgFile.createOutPut(null));
					zip.addFile(rpgFile);

					if(! buttonsEnabled) {
						enableFileButtons('clearFileList', 'zipSave');
						buttonsEnabled = true;
					}
				}
			});
		} else {
			decrypter.encryptFile(rpgFile, function(rpgFile, exception) {
				// Output Encrypted file
				if(exception !== null)
					outputEl.appendChild(rpgFile.createOutPut(exception.toString()));
				else {
					rpgFile.convertExtension(false);
					outputEl.appendChild(rpgFile.createOutPut(null));
					zip.addFile(rpgFile);

					if(! buttonsEnabled) {
						enableFileButtons('clearFileList', 'zipSave');
						buttonsEnabled = true;
					}
				}
			});
		}
	}
}

/**
 * Clears the File-List & disables the ZIP-Save-Button
 *
 * @param {string} fileListId - Id of the File-List
 * @param {string} zipSaveButtonId - Id of the ZIP-Save Button
 */
function clearFileList(fileListId, zipSaveButtonId) {
	var fileListEl = document.getElementById(fileListId);
	var zipSaveButtonEl = document.getElementById(zipSaveButtonId);

	if(! fileListEl || ! zipSaveButtonEl)
		return;

	fileListEl.innerHTML = '';
	zipSaveButtonEl.disabled = 'disabled';

	// Dispose old ZIP Object (Clear Memory)
	zip.dispose();
}

/**
 * ReEnables the Buttons for the File-List
 *
 * @param {string} clearFileListButtonId - Id of the Clear-File-List Button
 * @param {string} zipSaveButtonId - Id of the ZIP-Save Button
 */
function enableFileButtons(clearFileListButtonId, zipSaveButtonId) {
	var clearFileListButtonEl = document.getElementById(clearFileListButtonId);
	var zipSaveButtonEl = document.getElementById(zipSaveButtonId);

	if(! clearFileListButtonEl || ! zipSaveButtonEl)
		return;

	clearFileListButtonEl.disabled = '';
	zipSaveButtonEl.disabled = '';
}

/**
 * Saves the current Files as ZIP
 */
function saveZip() {
	zip.save();
}

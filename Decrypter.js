/**
 * Author: Peter Dragicevic [peter-91@hotmail.de]
 * Authors-Website: http://petschko.org/
 * Date: 30.03.2017
 * Time: 23:05
 */

/**
 * Creates a new instance of the Decrypter Object
 *
 * @param {string} encryptionKey - Encryption-Key
 * @constructor - Decrypter
 */
function Decrypter(encryptionKey) {
	// Encryption-Fields
	this.encryptCode = encryptionKey;

	// Option Fields
	this.ignoreFakeHeader = false;

	// Fake-Header Info-Fields
	this.headerLen = null;
	this.signature = null;
	this.version = null;
	this.remain = null;

	// Private Functions
	/**
	 * Splits the Encryption-Code into an Array
	 *
	 * @returns {Array} - Encryption-Array
	 */
	Decrypter.prototype.splitEncryptionCode = function() {
		return this.encryptCode.split(/(.{2})/).filter(Boolean);
	};
	this.encryptionCodeArray = this.splitEncryptionCode();

	/**
	 * Check if the current File-Header matches the Fake-Header
	 *
	 * @param {Uint8Array} fileHeader - Current-File-Header
	 * @returns {boolean} - true if header matches fake header else false
	 */
	Decrypter.prototype.verifyFakeHeader = function(fileHeader) {
		var fakeHeader = this.buildFakeHeader();

		for(var i = 0; i < this.getHeaderLen(); i++)
			if(fileHeader[i] !== fakeHeader[i])
				return false;

		return true;
	};

	/**
	 * Builds the Fake-Header
	 *
	 * @returns {Uint8Array} - Fake-Header-Array
	 */
	Decrypter.prototype.buildFakeHeader = function() {
		var fakeHeader = new Uint8Array(this.getHeaderLen());
		var headerStructure = this.getSignature() + this.getVersion() + this.getRemain();

		for(var i = 0; i < this.getHeaderLen(); i++)
			fakeHeader[i] = parseInt('0x' + headerStructure.substr(i * 2, 2), 16);

		return fakeHeader;
	};

	/**
	 * Removes the header from the ArrayObject by specifying its length
	 *
	 * @param {ArrayBuffer} arrayBuffer - ArrayBuffer Object
	 * @param {int} length - length of the header
	 * @returns {ArrayBuffer} - ArrayBuffer Object without header
	 */
	Decrypter.prototype.removeFakeHeader = function(arrayBuffer, length) {
		return arrayBuffer.slice(length, arrayBuffer.byteLength);
	};

	/**
	 * Do something with a RPGFile
	 *
	 * @param {RPGFile} rpgFile - RPGFile Object
	 * @param {string} modType - Specify what to do with that file
	 * @param {function} callback - Function if operation is done
	 */
	Decrypter.prototype.modifyFile = function(rpgFile, modType, callback) {
		var reader = new FileReader();

		reader.addEventListener('load', function() {
			var readerResult = this.result;
			//rpgFile.fileUrl = RPGFile.createBlobUrl(readerResult);

			switch(modType) {
				case 'encrypt':
					rpgFile.fileUrl = RPGFile.createBlobUrl(this.encrypt(readerResult));
					break;
				case 'decrypt':
				default:
					rpgFile.fileUrl = RPGFile.createBlobUrl(this.decrypt(readerResult));
			}

			callback(rpgFile);
		}, false);

		reader.readAsArrayBuffer(rpgFile.file);
	};

	/**
	 * Decrypts a RPG-Make-File-ArrayBuffer & may check the header if turned on
	 *
	 * @param {ArrayBuffer} arrayBuffer - Array-Buffer of the File
	 * @returns {ArrayBuffer} - Decrypted Array-Buffer of the File without the Fake-Header
	 */
	Decrypter.prototype.decrypt = function(arrayBuffer) {
		if(! arrayBuffer)
			throw new ErrorException('File is empty or can\'t be read by your Browser...', 1);

		var i;
		if(! this.ignoreFakeHeader) {
			var header = new Uint8Array(arrayBuffer, 0, this.headerLen);
			if(! this.verifyFakeHeader(header))
				throw new ErrorException(
					'Fake-Header don\'t matches the Template-Fake-Header. Make sure, that you use an Encrypted File.' +
					' - If you do, turn off "Fake-Header"-Check and try again.',
					2
				);
		}

		// Remove the Fake-Header from File-arrayBuffer
		arrayBuffer.slice(this.getHeaderLen(), arrayBuffer.byteLength);

		// Decrypt File beginning
		var view = new DataView(arrayBuffer);
		if(arrayBuffer) {
			var byteArray = new Uint8Array(arrayBuffer);
			for (i = 0; i < this.headerLen; i++) {
				// XOR-Bytes
				var tmp = byteArray[i]; // todo remove
				byteArray[i] = byteArray[i] ^ parseInt(this.encryptionCodeArray[i], 16);
				console.log('XOR: Byte ' + (i + 1) +
					' -> (FileByte) ' + tmp + ' ^ (KeyByte) ' + parseInt(this.encryptionCodeArray[i]) +
					' => ' + byteArray[i]); // todo remove line
				view.setUint8(i, byteArray[i]);
			}
		}

		return arrayBuffer;
	};

	/**
	 * todo implement
	 *
	 * @param arrayBuffer
	 * @returns {*}
	 */
	Decrypter.prototype.encrypt = function(arrayBuffer) {
		return arrayBuffer;
	};
}
// Class constants
Decrypter.prototype.defaultHeaderLen = 16;
Decrypter.prototype.defaultSignature = "5250474d56000000";
Decrypter.prototype.defaultVersion = "000301";
Decrypter.prototype.defaultRemain = "0000000000";

/**
 * Returns the Header Len
 *
 * @returns {int} - Header-Len
 */
Decrypter.prototype.getHeaderLen = function() {
	if(this.headerLen === null || typeof this.headerLen !== 'number')
		this.headerLen = this.defaultHeaderLen;

	// Ensure int
	return Math.floor(this.headerLen);
};

/**
 * Returns the Signature
 *
 * @returns {string} - Signature
 */
Decrypter.prototype.getSignature = function() {
	if(this.signature === null)
		this.signature = this.defaultSignature;

	return this.signature;
};

/**
 * Returns the Version
 *
 * @returns {string} - Version
 */
Decrypter.prototype.getVersion = function() {
	if(this.version === null)
		this.version = this.defaultVersion;

	return this.version;
};

/**
 * Returns the Remain
 *
 * @returns {string} - Remain
 */
Decrypter.prototype.getRemain = function() {
	if(this.remain === null)
		this.remain = this.defaultRemain;

	return this.remain;
};

/**
 * Decrypts a RPGFile
 *
 * @param {RPGFile} rpgFile - RPGFile to Decrypt
 * @param {function} callback - Function if operation is done
 */
Decrypter.prototype.decrypt = function(rpgFile, callback) {
	this.modifyFile(rpgFile, 'decrypt', callback);
};

/**
 * Encrypts a RPGFile
 *
 * @param {RPGFile} rpgFile - RPGFile to Decrypt
 * @param {function} callback - Function if operation is done
 */
Decrypter.prototype.encrypt = function(rpgFile, callback) {
	this.modifyFile(rpgFile, 'encrypt', callback)
};

/**
 * Detect the Encryption-Code from a RPGFile
 *
 * @param {RPGFile} rpgFile - RPGFile Object
 * @param {function} callback - Function if operation is done
 */
Decrypter.detectEncryptionCode = function(rpgFile, callback) {
	var reader = new FileReader();

	reader.addEventListener('load', function() {
		var key;

		try {
			var fileContent = JSON.parse('[' + this.result + ']');
			key = fileContent[0].encryptionKey;
		} catch(e) {
			key = null;
		}

		callback(key);
	}, false);

	reader.readAsText(rpgFile.file);
};

/**
 * Check if the string only has HEX-Chars (0-9 & A-F)
 *
 * @param {string} string - String to verify
 * @returns {boolean} - true if string is valid else false
 */
Decrypter.checkHexChars = function(string) {
	//todo
	return true;
};

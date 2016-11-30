

function Decrypter() {
	throw new Error('This is a static class');
}

Decrypter.plainDecryptionCode = "";
Decrypter._headerlength = 16;
Decrypter._xhrOk = 400;
Decrypter._encryptionKey = "";
Decrypter.SIGNATURE = "5250474d56000000";
Decrypter.VER = "000301";
Decrypter.REMAIN = "0000000000";

Decrypter.decryptImg = function(url) {
	var requestFile = new XMLHttpRequest();
	requestFile.open("GET", url);
	requestFile.responseType = "arraybuffer";
	requestFile.send();

	requestFile.onload = function () {
		if(this.status < Decrypter._xhrOk) {
			var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
			var blobURL = Decrypter.createBlobUrl(arrayBuffer);

			document.getElementById('blob').innerHTML += '<a href="' + blobURL + '" target="_blank">' + blobURL + '</a><br>';
		}
	};
};

Decrypter.cutArrayHeader = function(arrayBuffer, length) {
	return arrayBuffer.slice(length);
};

Decrypter.decryptArrayBuffer = function(arrayBuffer) {
	if (!arrayBuffer) return null;
	var header = new Uint8Array(arrayBuffer, 0, this._headerlength);

	var i;
	var ref = this.SIGNATURE + this.VER + this.REMAIN;
	var refBytes = new Uint8Array(16);
	for (i = 0; i < this._headerlength; i++) {
		refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
	}
	for (i = 0; i < this._headerlength; i++) {
		if (header[i] !== refBytes[i]) {
			throw new Error("Header is wrong");
		}
	}

	arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
	var view = new DataView(arrayBuffer);
	this.readEncryptionkey();
	if (arrayBuffer) {
		var byteArray = new Uint8Array(arrayBuffer);
		for (i = 0; i < this._headerlength; i++) {
			byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
			view.setUint8(i, byteArray[i]);
		}
	}

	return arrayBuffer;
};

Decrypter.createBlobUrl = function(arrayBuffer){
	var blob = new Blob([arrayBuffer]);
	return window.URL.createObjectURL(blob);
};

Decrypter.readEncryptionkey = function(){
	this._encryptionKey = this.plainDecryptionCode.split(/(.{2})/).filter(Boolean);
};

import CryptoJS from "crypto-js";

export function clientUniqueCode() {
	const character = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let response = "";
	for (let i = 32; i > 0; --i) response += character[Math.floor(Math.random() * character.length)];
	return response;
}

export function ConvertStringToHex(str) {
	var arr = [];
	for (var i = 0; i < str.length; i++) {
		arr[i] = str.charCodeAt(i).toString(16).slice(-4);
	}
	var print = "";
	for (var j = 0; j < str.length; j++) {
		print += arr[j];
	}
	return print;
}

export function maskingPwd(password) {
	if (password !== "") {
		let key = "63706d5f70617373776f7264"
		key = ConvertStringToHex(key)  // Hex String
		key = CryptoJS.enc.Hex.parse(key) // Bytes

		let encrypted = CryptoJS.TripleDES.encrypt(password, key, {
			mode: CryptoJS.mode.ECB,
		}); // Not ASCII
		return encrypted.toString()
	}
}

export function encryptContent({ payload, clientKey, sharedKey }) {
	let key = clientKey + "1001" + sharedKey
	key = CryptoJS.SHA512(key)
	
	key = key.toString()
	key = key.substring(32, 64)
	let encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), CryptoJS.enc.Utf8.parse(key), {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString()
}

export function decryptContent({ payload, clientKey, sharedKey }) {
	let key = clientKey + "1001" + sharedKey
	key = CryptoJS.SHA512(key)
  
	key = key.toString()
	key = key.substring(32, 64)
	let decrypted = CryptoJS.AES.decrypt(payload, CryptoJS.enc.Utf8.parse(key), {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypted.toString(CryptoJS.enc.Utf8)
}
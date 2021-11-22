var { generateKeyPairSync, privateDecrypt, constants } = require("crypto");

var CryptoJS = require("node-cryptojs-aes").CryptoJS;

function encryptData(data, clientKey) {
  var cip = CryptoJS.AES.encrypt(data, clientKey).toString();
  return cip;
}

function decryptData(data, clientKey) {
  var cip = CryptoJS.AES.decrypt(data, clientKey);
  cip = CryptoJS.enc.Utf8.stringify(cip);
  return cip;
}

function decryptRSAData(data, privateKey) {
  let textBuffer, decryptText;
  try {
    textBuffer = Buffer.from(data, "base64");
    // jsencrypt library uses Base64 encoding after encryption, so the encrypted text of Base64 must be converted to buffer first.
    decryptText = privateDecrypt(
      {
        key: privateKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      textBuffer
    ).toString("utf8");
  } catch (err) {
    console.error(err);
  }
  return decryptText;
}

async function generateKeys() {
  return generateKeyPairSync("rsa", {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
}

module.exports = {
  encryptData,
  decryptRSAData,
  decryptData,
  generateKeys,
};

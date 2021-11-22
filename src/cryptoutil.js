var { generateKeyPairSync, privateDecrypt, constants } = require("crypto");

function encryptData(data) {}

function decryptData(data, privateKey) {
  console.log(data);
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

    console.log(decryptText);
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
  decryptData,
  generateKeys,
};

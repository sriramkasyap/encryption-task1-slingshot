var crypto,
  { generateKeyPairSync } = require("crypto");

function encryptData(data) {}

function decryptData(data) {}

async function generateKeys() {
  return generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
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

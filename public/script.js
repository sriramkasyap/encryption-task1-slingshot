var publicKey;

document.getElementById("mainButton").onclick = (e) => {
  e.preventDefault();
  document.getElementById("mainButton").innerText = "Authenticating";
  fetch("/auth/init", {
    method: "POST",
  })
    .then((r) => r.json())
    .then(async (r) => {
      if (await testSecureChannel(r)) {
        console.log("Secure Channel Established");
        document.getElementById("mainButton").innerText = "Channel Secure";
        document.getElementById("mainButton").setAttribute("disabled", true);

        document.getElementById("status").innerHTML =
          "Secure Channel Established";
      }
    });
};

function generateRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function testSecureChannel(r) {
  var crypt = new JSEncrypt();
  publicKey = r.publicKey;

  crypt.setPublicKey(publicKey); //You can use also setPrivateKey and setPublicKey, they are both alias to setKey

  var text = "test";
  // Encrypt the data with the public key.
  var enc = crypt.encrypt(text);

  // Verify if the encrypt can be decrypted by backend
  return fetch("/auth/decrypt", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      hashed: enc,
    }),
  })
    .then((r) => r.json())
    .then((result) => {
      return result.success && result.result === text;
    });
}

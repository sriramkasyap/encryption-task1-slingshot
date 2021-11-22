document.getElementById("mainButton").onclick = (e) => {
  e.preventDefault();
  document.getElementById("mainButton").innerText = "Authenticating";
  fetch("/auth/init", {
    method: "POST",
  })
    .then((r) => r.json())
    .then(async (r) => {
      var crypt = new JSEncrypt();
      console.log(r.publicKey);

      crypt.setPublicKey(r.publicKey); //You can use also setPrivateKey and setPublicKey, they are both alias to setKey

      var text = "test";
      // Encrypt the data with the public key.
      var enc = crypt.encrypt(text);

      console.log(enc);
      return enc;
    })
    .then((enc) => {
      fetch("/auth/decrypt", {
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
          console.log(result);
        });
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

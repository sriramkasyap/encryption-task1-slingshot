var publicKey, messages, clientKey;

document.getElementById("mainButton").onclick = (e) => {
  e.preventDefault();
  document.getElementById("mainButton").innerText = "Authenticating";
  fetch("/auth/init", {
    method: "POST",
  })
    .then((r) => r.json())
    .then(async (r) => {
      // if (await testSecureChannel(r)) {
      //   console.log("Encryption Check Successful");
      //   document.getElementById("mainButton").innerText = "Channel Secure";
      //   document.getElementById("mainButton").setAttribute("disabled", true);

      //   document.getElementById("status").innerHTML =
      //     "Encryption Check Successful<br/>";

      await establishSecureChannel(r);
      setUpForm();
      // }
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

async function establishSecureChannel(result) {
  publicKey = result.publicKey;
  clientKey = generateRandomString(32);

  console.log("Encryption Key", clientKey);

  var crypt = new JSEncrypt();

  crypt.setPublicKey(publicKey); //You can use also setPrivateKey and setPublicKey, they are both alias to setKey

  // Encrypt the data with the public key.
  var clientKeyEnrypted = crypt.encrypt(clientKey);

  return fetch("/auth/setupClient", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      clientKeyEnrypted,
    }),
  })
    .then((r) => r.json())
    .then(async ({ result }) => {
      let message = await clientDecrypt(result);

      document.getElementById("mainButton").innerText = "Channel Secure";
      document.getElementById("mainButton").setAttribute("disabled", true);

      document.getElementById("status").append(message);
      document.getElementById("form").style.display = "block";
    });
}

async function setUpForm() {
  document.getElementById("form").onsubmit = (e) => {
    e.preventDefault();
    transmit(e.target.elements.message.value);
  };
}

async function transmit(message) {
  console.log("Message", message);

  let messageHashed = CryptoJS.AES.encrypt(message, clientKey).toString();

  console.log("Encrypted Message", messageHashed);

  fetch("/message", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      messageHashed,
    }),
  })
    .then((r) => r.json())
    .then(async ({ result }) => {
      console.log("Response", result);
      let response = await clientDecrypt(result);
      console.log("Response Decrypted", response);
      let li = document.createElement("li");
      li.innerText = response;
      document.getElementById("messages").append(li);
      document.getElementById("message").value = "";
    });
}

async function clientDecrypt(message) {
  var nosalt = CryptoJS.lib.WordArray.random(0);
  var enc = CryptoJS.AES.decrypt(message, clientKey, { salt: nosalt });

  return CryptoJS.enc.Utf8.stringify(enc);
}

var express = require("express");
var path = require("path");
const {
  generateKeys,
  decryptRSAData,
  encryptData,
  decryptData,
} = require("./cryptoutil");

var app = express();

app.use(express.json());

app.use("/static", express.static("public"));

var clientKey = "";
var privateKey = "";
var publicKey = "";

app.get("/", (req, res) => {
  // Generate

  res.sendFile(path.join("public", "index.html"), {
    root: "./",
  });
});

app.post("/auth/init", async (req, res) => {
  // Generate Pk, Sk

  var keyset = await generateKeys();
  privateKey = keyset.privateKey;
  publicKey = keyset.publicKey;

  // Send Pk to client

  res.send({
    success: true,
    publicKey,
  });
});

app.post("/auth/decrypt", async (req, res) => {
  let { hashed } = req.body;

  let result = decryptRSAData(hashed, privateKey);

  return res.send({
    success: true,
    result,
  });
});

app.post("/auth/setupClient", async (req, res) => {
  let { clientKeyEnrypted } = req.body;

  clientKey = decryptRSAData(clientKeyEnrypted, privateKey);

  let result = encryptData("Secure Connection established", clientKey);

  return res.send({
    success: true,
    result,
  });
});

app.post("/message", async (req, res) => {
  let { messageHashed } = req.body;

  let message = decryptData(messageHashed, clientKey);

  let reversedMessage = message.split("").reverse().join("");

  let result = encryptData(reversedMessage, clientKey);

  return res.send({
    success: true,
    result,
  });
});

app.get("/auth/me", (req, res) => {
  return res.send({
    success: true,
    publicKey,
  });
});

module.exports = app;

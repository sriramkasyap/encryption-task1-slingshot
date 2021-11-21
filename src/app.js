var express = require("express");
var path = require("path");
const { generateKeys } = require("./cryptoutil");

var app = express();

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

app.get("/auth/me", (req, res) => {
  return res.send({
    success: true,
    publicKey,
  });
});

module.exports = app;

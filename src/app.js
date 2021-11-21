var express = require("express");
var path = require("path");

var app = express();

var clientKey = "";
var secretKey = "";
var publicKey = "";

app.get("/", (req, res) => {
  // Generate

  res.sendFile(path.join("public", "index.html"), {
    root: "./",
    headers: {
      key: clientKey,
    },
  });
});

app.post("/auth/init", (req, res) => {
  // Generate Pk, Sk

  // Send Sk to client

  res.send({
    success: true,
    secretKey,
  });
});

module.exports = app;

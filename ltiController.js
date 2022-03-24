const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("./src/config/config.json");
const jwksClient = require("jwks-rsa");
const open = require("open");

exports.oidcLogin = (req, res) => {
  let state = uuid.v4();
  let nonce = uuid.v4();
  const { login_hint, message_hint } = req.query;
  let url =
    "http://localhost:3000/launch/login?response_type=id_token" +
    "&scope=openid" +
    "&login_hint=" +
    login_hint +
    "&lti_message_hint=" +
    message_hint +
    "&state=" +
    state +
    "&redirect_uri=" +
    encodeURIComponent(config.frontendUrl) +
    "&client_id=" +
    config.bbClientId +
    "&nonce=" +
    nonce;

  res.cookie("state", state);
  config.state = state;
  res.redirect(url);
};

exports.launchTool = (req, res) => {
  console.log("BODY====", config.state);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  const client = jwksClient({
    jwksUri: "http://localhost:3000/.well-known/jwks.json",
  });
  function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }
  jwt.verify(token, getKey, { algorithm: "RS256" }, function (err, decoded) {
    if (err) {
      console.log("JWT VERIFY ERROR---", err);
      res.send({ message: "Invalid Token" });
    } else {
      console.log("TOKEN VERIFIED****");
      open("http://localhost:5000");
      res.send({ message: "Authentication Successfull" });
    }
  });
};

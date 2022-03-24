const router = require("express").Router();
const { oidcLogin, launchTool } = require("./ltiController");

router.get("/initiate/oidc", oidcLogin);

router.post("/launch", launchTool);

router.get("/protected", (req, res) => {
  res.send({ message: "from protected resource" });
});

router.post("/authorize", oidcLogin);

module.exports = router;

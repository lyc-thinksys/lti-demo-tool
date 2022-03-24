const bodyParser = require("body-parser");
const express = require("express");
const expressJwt = require("express-jwt");
const jwksClient = require("jwks-rsa");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const allowedDomains = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://localhost:3000",
  "https://localhost:5000",
  "self",
];
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "build")));
const PORT = process.env.PORT || 5000;
const ltiRoutes = require("./ltiroutes");
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: allowedDomains,
      },
    },
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: false,
      preload: true,
    },

    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    originAgentCluster: true,
    frameguard: {
      action: "sameorigin",
    },
  })
);

let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowedDomains.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from your IP, please try again in an hour!",
});

app.use("/", limiter);

app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(
  expressJwt({
    secret: jwksClient.expressJwtSecret({
      jwksUri: "http://localhost:5000/.well-known/jwks.json",
      cache: true,
      rateLimit: true,
    }),
    algorithms: ["RS256"],
  }).unless({
    path: [
      "/",
      "/api/lti/launch",
      "/api/lti/oauth",
      "/api/lti/authorize",
      "/api/lti/initiate/oidc",
    ],
  })
);

app.use("/api/lti", ltiRoutes);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

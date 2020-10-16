const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongo");
const routes = require("./router/index");
const dbConnect = require("./utils/dbConnect");
const passport = require("passport");
const User = require("./model/User");
const LocalStrategy = require("passport-local");
const ROOT_URL = dev ? `http://localhost:${PORT}` : process.env.PRODUCTION_URL;

// Loads all variables from .env file to "process.env"
require("dotenv").config();

// db connect
dbConnect();

app.prepare().then(() => {
  const server = express();

  // body parser
  server.use(express.json({ extended: false }));

  /* give all Next.js's requests to Next.js server */
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  // sessions
  const MongoStore = mongoSessionStore(session);

  const sessionConfig = {
    name: "next-connect.sid",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // save session for 14 days
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
    },
  };

  if (!dev) {
    sessionConfig.cookie.secure = true; // serve secure cookies in production environment
    server.set("trust proxy", 1); // trust first proxy
  }

  server.use(session(sessionConfig));

  // passport middleware
  server.use(passport.initialize());
  server.use(passport.session());

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  // local variables
  server.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
  });

  server.use("/", routes);

  /* Error handling from async / await functions */
  server.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  /* create custom routes with route params */
  server.get("/profile/:userId", (req, res) => {
    const routeParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/profile", routeParams);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => console.log("server is running"));
});

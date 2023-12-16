var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const config = require("./config/config");
const jwt = require("jsonwebtoken");

const Usuario = require("./models/usuario");

var indexRouter = require("./routes/index");
//var usuariosRouter = require("./routes/usuarios");
var tokenRouter = require("./routes/token");
//var bicicletasRouter = require("./routes/bicicletas");
var bicicletasAPIRouter = require("./routes/api/bicicletas");
var usuariosAPIRouter = require("./routes/api/usuarios");
//var sessionRouter = require("./routes/session");
var authAPIRouter = require("./routes/api/auth");
const passport = require("./config/passport");
const session = require("express-session");

const store = new session.MemoryStore();

const SECRET_SESSION = config.secretSession;
const SECRET_KEY = config.secretKey;

var app = express();
app.use(
  session({
    cookie: { maxAge: 240 * 60 * 60 * 1000 },
    store: store,
    saveUninitialized: true,
    resave: "true",
    secret: SECRET_SESSION,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize()); // Inicializamos passport
app.use(passport.session()); // Inicializamos la sesión de passport
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
//app.use("/usuarios", usuariosRouter);
app.use("/token", tokenRouter);
//app.use("/bicicletas", loggedIn, bicicletasRouter);
app.use("/api/bicicletas", validarUsuario, bicicletasAPIRouter);
app.use("/api/usuarios", validarUsuario, usuariosAPIRouter);
//app.use("/session", sessionRouter);
app.use("/api/auth", verificado, authAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log("Usuario sin loguearse" + req.usuario);
    res.redirect("/session/login");
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(
    req.headers["x-access-token"],
    SECRET_KEY,
    function (err, decoded) {
      if (err) {
        res.json({ status: "error", message: err.message, data: null });
      } else {
        req.body.userId = decoded.id;
        console.log("jwt verify: " + decoded);
        next();
      }
    }
  );
}

async function verificado(req, res, next) {
  var usuario = await Usuario.findOne({ email: req.body.email });
  console.log("verificado: " + usuario);
  if (usuario.verificado) {
    next();
  } else {
    console.log("Usuario sin verificar" + req.body.userId);
    res
      .status(401)
      .json({
        status: "unauthorized",
        message: "Usuario no verificado",
        data: null,
      });
  }
}
module.exports = app;

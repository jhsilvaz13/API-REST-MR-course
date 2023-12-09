const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../models/usuario");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      const usuario = await Usuario.findOne({ email: email });
      if (!usuario) {
        return done(null, false, {
          message: "Email no existente o incorrecto",
        });
      }
      if (!usuario.validPassword(password)) {
        return done(null, false, { message: "Password incorrecto" });
      }
      return done(null, usuario);
    }
  )
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function ( id, done) {
    Usuario.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
}
);

module.exports = passport;

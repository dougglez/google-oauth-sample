var express = require('express');
var session = require('express-session');
var massive = require('massive');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config.js');

var massiveInstance = massive.connectSync({ connectionString: config.connectionString });

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
}, function (accessToken, refreshToken, profile, done) {
    db.find_By_Id([profile.id], function (err, user) {
        if (!user[0]) {
            console.log(user);
            db.create_user([
                profile.id, profile.name.familyName, profile.name.givenName, profile.photos[0].value + '0',
                accessToken
            ], function (err, user) {
                console.log(user);
                return done(err, user[0]);
            });

        }

        return done(err, user[0]);
    });

}));
passport.serializeUser(function (user, done) {
    // console.log(user + "user")
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    // console.log(id + "id");
    db.find_By_Id([id], function (err, user) {
        done(err, user);
    });
});
var app = module.exports = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: (1000 * 60 * 60 * 24 * 14) // 14 days
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('db', massiveInstance);
var db = app.get('db');

var userCtrl = require("./controllers/userCtrl.js");
app.get('/getuserinfo', userCtrl.getUserInfo); //getting userinfo from database
// app.post('/createEvent', function(req, res) {

// })


app.get('/logout', function (req, res) {
    req.session.destroy(function (err, data) {
    });
});
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/calendar'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/#/' }), function (req, res) {
    res.redirect('/#/');
});

app.listen(config.port, function () {
    console.log("Yo, it's your port, " + config.port);
});

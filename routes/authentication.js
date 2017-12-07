let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let config = require('../config');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let objectID = require('mongodb').ObjectID;
let _ = require('lodash');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2('1067732667127-mnv03s04gq8ld62hh18uu6ve5h6q5bo0.apps.googleusercontent.com', '', '');

module.exports = (app, dbs, passport, io) => {

    passport.use(new JwtStrategy({
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, (jwt_payload, next) => {
        dbs.development.collection('users').findOne({ _id: objectID(jwt_payload.id) }, (err, user) => {
            if (err) return next(err);
            if(user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    }));

    app.post('/api/auth/login', (req, res) => {
        dbs.development.collection('users').findOne({ email: req.body.username }, (err, user) => {
            if (err) {
                return res.sendStatus(500);
            }
            if(user && bcrypt.compareSync(req.body.password, user.password)) {
                let payload = {id: user._id};
                let token = jwt.sign(payload, config.secret);
                res.json({token: token, user: _.omit(user, ['password'])});
            } else {
                return res.sendStatus(401);
            }
        });
    });

    app.post('/api/auth/login/google', (req, res) => {
        if(req.body.token) {
            client.verifyIdToken(
                req.body.token,
                '1067732667127-mnv03s04gq8ld62hh18uu6ve5h6q5bo0.apps.googleusercontent.com',
                function(e, login) {
                    console.log(login);
                    console.log(e);
                //   var payload = login.getPayload();
                //   var userid = payload['sub'];
                });
        } else {
            res.sendStatus(401);
        }
        
    });
}
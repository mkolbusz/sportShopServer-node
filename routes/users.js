let bcrypt = require('bcryptjs');
let Q = require('q');
let config = require('../config');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(config.google.clientID, '', '');

module.exports = (app, dbs, jwt) => {
    app.post('/users/signup', (req, res) => {
        dbs.development.collection('users').save({email: req.body.email, password: req.body.password}, (err, doc) => {
            if(err) {
                return res.json({'error': err});
            }
            return res.json({'message': 'Success'});
        })
    })

    app.post('/users/login', (req, res) => {
        let deferred = Q.defer();
        dbs.development.collection('users').findOne({ email: req.body.email }, (err, user) => {
            if (err) deferred.reject(err.name + ': ' + err.message);

            // if(user && bcrypt.compareSync(req.body.password, user.password)) {
            if(user && req.body.password == user.password) {
                deferred.resolve({
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: jwt.sign({ sub: user._id }, config.secret)
                });
            } else {
                deferred.resolve();
            }
        });

        deferred.promise.then((user) => {
            if(user) {
                return res.json(user);
            } else {
                return res.sendStatus(400);
            }
        }).catch((err) => {
            return res.sendStatus(400);
        })
    });

    app.post('/users/login/google', (req, res) => {
        if(req.body.token) {
            console.log(req.body.token);
            client.verifyIdToken(
                req.body.token,
                config.google.clientID,
                function(e, login) {
                    console.log(login);
            });
        }
    })
}
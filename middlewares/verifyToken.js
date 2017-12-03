let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, 'sssh', (err, decoded) => {
            if(err) {
                return res.json({error: true});
            }
            req.decoded = decoded;
            next();
        })
    } else {
        return res.status(403).send({error: true});
    }
}
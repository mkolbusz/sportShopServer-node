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
        let data = {
            email: req.body.email,
            password: req.body.password
        };

        dbs.development.collection('users').findOne(data, (err, user) => {
            if(err) {
                return res.json({error: true});
            }

            if(!user) {
                return res.status(404).json({'message': 'User not found'});
            }

            let token = jwt.sign(user, 'sssh', {expiresIn: 1140});
            res.json({error: false, token: token});
        })
    });
}
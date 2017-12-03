let verifyToken = require('../middlewares/verifyToken');

module.exports = (app, dbs, jwt) => {

    require('./products')(app, dbs, jwt);

    require('./orders')(app, dbs, jwt);
    
    require('./users')(app, dbs, jwt);

    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','PUT');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        return res.send();
    })

}
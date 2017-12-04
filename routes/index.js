let verifyToken = require('../middlewares/verifyToken');

module.exports = (app, dbs, jwt, io) => {

    require('./products')(app, dbs, jwt, io);

    require('./orders')(app, dbs, jwt, io);
    
    require('./users')(app, dbs, jwt, io);

    require('./promotions')(app, dbs, jwt, io);

    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        return res.send();
    })

}
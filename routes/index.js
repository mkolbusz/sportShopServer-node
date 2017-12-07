let verifyToken = require('../middlewares/verifyToken');

module.exports = (app, dbs, passport, io) => {

    require('./products')(app, dbs, passport, io);

    require('./orders')(app, dbs, passport, io);
    
    require('./users')(app, dbs, passport, io);

    require('./promotions')(app, dbs, passport, io);

    require('./authentication')(app, dbs, passport, io);

    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        return res.send();
    })

}
let objectID = require('mongodb').ObjectID;

module.exports = (app, dbs, jwt) => {

    app.put('/order/new', (req, res) => {
        dbs.development.collection('orders').insert(req.body, (err, doc) => {
            if(!err) {
                return  res.header('Access-Control-Allow-Origin','*').json({message: true});
            }
        })
    });

    app.get('/orders', (req, res) => {
        dbs.development.collection('orders').find().toArray((err, docs) => {
            return res.header('Access-Control-Allow-Origin','*').json(docs);
        });
    })

    app.put('/order/:id/status', (req, res) => {
        dbs.development.collection('orders').updateOne({_id: objectID(req.params.id)}, req.body, (err, doc) => {
            if(err) {
                console.error(1, err);
                return res.sendStatus(404);
            }

            console.log(2, doc);
            return res.sendStatus(200);
        });
    })
}
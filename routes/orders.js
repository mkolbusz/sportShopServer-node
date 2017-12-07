let objectID = require('mongodb').ObjectID;

module.exports = (app, dbs, jwt, io) => {

    app.put('/order/new', (req, res) => {
        req.body.products.map(item => {
            dbs.development.collection('products')
                .updateOne({_id: objectID(item.product.id)},item.product, (err, doc) => {
                    if(err){
                        console.error(err);
                        return res.sendStatus(500);
                    }

                    if(!doc) {
                        console.error(doc);
                    }
                    return;
                })
        });
        
        dbs.development.collection('orders').insert(req.body, (err, doc) => {
            if(err) {
                console.error(err);
                return  res.sendStatus(500);
            }

            io.emit('new-order', req.body);
            return  res.sendStatus(200);
        }); 

    });

    app.get('/orders', (req, res) => {
        dbs.development.collection('orders').find().toArray((err, docs) => {
            return res.json(docs);
        });
    })

    app.put('/order/:id/status', (req, res) => {
        dbs.development.collection('orders').updateOne({_id: objectID(req.params.id)}, req.body, (err, doc) => {
            if(err) {
                console.error(1, err);
                return res.sendStatus(500);
            }

            console.log(2, doc);
            return res.sendStatus(200);
        });
    })
}
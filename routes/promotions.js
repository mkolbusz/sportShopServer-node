let schedule = require('node-schedule');
let moment = require('moment');
let objectID = require('mongodb').ObjectID;

module.exports = (app, dbs, jwt, io) => {
    app.put('/promotions/new', (req, res) => {
        let promotion = req.body;
        let expireDate = moment().add(promotion.time, 'minutes').toDate();

        console.log('Start of promotion:');
        console.log(promotion);

        io.emit('new-promotion', promotion);
        promotion.products.map(product => {
            let newPrice = product.price - (product.price * promotion.discount/100.00);
            dbs.development.collection('products').updateOne({_id: objectID(product.id)},{ $set:{price: newPrice }});
        });

        schedule.scheduleJob(expireDate, function() {
            console.log('End of promotion:');
            console.log(promotion);
            promotion.products.map(product => {
                let newPrice = product.price;
                dbs.development.collection('products').updateOne({_id: objectID(product.id)},{ $set:{price: newPrice }});
            })
            io.emit('end-promotion', promotion);
        })

        
        return res.json({send: true});
    });
}
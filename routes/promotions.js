let schedule = require('node-schedule');
let moment = require('moment');

module.exports = (app, dbs, jwt, io) => {
    app.put('/promotions/new', (req, res) => {
        let promotion = req.body;
        let expireDate = moment().add(promotion.time, 'minutes').toDate();

        io.emit('new-promotion', promotion);
        schedule.scheduleJob(expireDate, function() {
            console.log('End of promotion' + promotion);
            io.emit('end-promotion', promotion);
        })

        
        

        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','PUT');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        return res.json({send: true});
    });
}
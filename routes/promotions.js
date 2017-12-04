let schedule = require('node-schedule');
let moment = require('moment');

module.exports = (app, dbs, jwt, io) => {
    app.put('/promotions/new', (req, res) => {
        let promotion = req.body;
        let expireDate = moment().add(promotion.time, 'minutes').toDate();

        console.log('Start of promotion:');
        console.log(promotion);
        io.emit('new-promotion', promotion);
        schedule.scheduleJob(expireDate, function() {
            console.log('End of promotion:');
            console.log(promotion);
            io.emit('end-promotion', promotion);
        })
        return res.json({send: true});
    });
}
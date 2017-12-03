let express = require('express');
let app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

let jwt = require('jsonwebtoken');
let bodyParser = require('body-parser');

let initializeDatabases = require('./dbs/index');
let routes = require('./routes/index');

let port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

io.origins(['*:*']);
io.on('connection', (socket) => {
    console.log('connection lecimy tutaj...');

    socket.on('changeQty', (data) => {
        console.log(data);
    })
})

initializeDatabases((err, dbs) => {
    if(err) {
        console.error('Failed to make all database connections!');
        console.error(err);
        process.exit(1);
    }

    routes(app, dbs, jwt);

    server.listen(port, function() {
        console.log('Listening on port ' + port);
    });

  

});

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let cors = require('cors');
let bodyParser = require('body-parser');

let initializeDatabases = require('./dbs/index');
let routes = require('./routes/index');
let passport = require('passport');
let port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());

io.origins(['*:*']);
io.on('connection', (socket) => {
    console.log('connection by socket established');
})

initializeDatabases((err, dbs) => {

    if(err) {
        console.error('Failed to make all database connections!');
        console.error(err);
        process.exit(1);
    }

    routes(app, dbs, passport, io);

    server.listen(port, function() {
        console.log('Listening on port ' + port);
    });
});

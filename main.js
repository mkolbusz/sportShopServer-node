let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let cors = require('cors');

let expressJwt = require('express-jwt');
let jwt = require('jsonwebtoken');
let bodyParser = require('body-parser');

let initializeDatabases = require('./dbs/index');
let routes = require('./routes/index');
let config = require('./config');

let port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// app.use(expressJwt({
//     secret: config.secret,
//     getToken: function (req) {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         } else if (req.query && req.query.token) {
//             return req.query.token;
//         }
//         return null;
//     }
// }).unless({ path: ['/products', '/users/signup', '/users/login','/users/login/google', '/products/image/upload'] }));

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

    routes(app, dbs, jwt, io);

    server.listen(port, function() {
        console.log('Listening on port ' + port);
    });
});

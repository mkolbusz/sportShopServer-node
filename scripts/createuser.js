let initializeDatabases = require('../dbs/index');
let argv = require('process.argv')(process.argv.slice(2));
let bcrypt = require('bcryptjs');
let config = argv({});

initializeDatabases((err, dbs) => {
    let user = {
        email: config.email,
        password: bcrypt.hashSync(config.password, 10)
    };
    dbs.development.collection('users').insert(user, (err, doc) => {
        if(err) {
            return console.error(err);
        }
        return console.log(doc)
        
    })
});
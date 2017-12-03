var async = require('async');
var MongoClient = require('mongodb').MongoClient;

var URI = "mongodb://mkolbusz:xzaq1234@ds121726.mlab.com:21726/sportshop";

var databases = {
    development: async.apply(MongoClient.connect, URI)
}

module.exports = (cb) => {
    async.parallel(databases, cb);
}
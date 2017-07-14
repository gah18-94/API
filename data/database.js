
//database.js
(function (database) {
    var mongoUrl = "mongodb://localhost:27017/AuditLog"
    var mongo = require('mongodb').MongoClient;

    database.getDb = function (next) { 
            //connect to the database
            mongo.connect(mongoUrl, function (err, db) {
                if (err) {
                    next(err, null);
                } else {
                   var theDb = {
                       db: db,
                       Logs: db.collection("Logs")
                    };
                    next(null,theDb);
                }
            });
    }

})(module.exports);
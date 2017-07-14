// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var database = require("./data/database");
var SeedData = require("./data/SeedData");

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.all('/*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Port number
var port = 3000;


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Running...');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'Please enter a valid route.' });
    console.log('Get /');
});

// on routes that end in /Logs
// ----------------------------------------------------
router.route('/Log')

    // create a Log (accessed at POST http://localhost:8080/Log)
    .post(function (req, res) {

        /*var alog = new Log();		// create a new instance of the Log model*/
        var log = {
            
                Date: moment(Date()).format("YYYY-MM-DD HH:mm"),  // set the Log description (comes from the request)
                Description: req.query.Description,
                Type: req.query.Type
            
        };
        console.log('Post Log: before save');
        database.getDb(function (err, db) {
            if (err) {
                res.set(err, null);
            } else {
                db.Logs.insert(log, function (err) {
                    if (err) {
                        console.log('err saving log');
                        res.send(err);
                    } else {
                        console.log('Log save succesfully');
                        res.json({ message: 'Log saved.' });
                    }
                });
            }
        });


    })

    // get all the Logs (accessed at GET http://localhost:8080/api/Log)
    .get(function (req,res) {
        // test to see if data exists
        res.set("Content-Type", "application/json");
        console.log('Get Logs');
        database.getDb(function (err, db) {
            if (err) {
                res.set(err, null);
            } else {
                db.Logs.find().toArray(function (err, results) {
                    if (err) {
                        res.send({err});
                    } else {
                        var Logs = results;
                        res.send({ Logs});
                    }
                });
            }
        });
  
    });




// REGISTER OUR ROUTES -------------------------------
console.log('app.use( / api, router);');
app.use('/api', router);


// START THE SERVER
// =============================================================================
console.log('app.listen(port);');

app.listen(port);
console.log('Listening on port ' + port);

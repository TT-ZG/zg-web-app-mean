// ==============================================
// GET DEPENDENCIES
// ==============================================
var express    = require('express'),
		app        = express(),
		bodyParser = require('body-parser'),
		morgan     = require('morgan'),
		mongoose   = require('mongoose'),
		path 	   	 = require('path');


// ==============================================
// APP CONFIGURATION
// ==============================================
// lets us get info from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// lets us handle CORS requests (cross-domain)
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests
app.use(morgan('dev'));

//Get keys for the DB
var dbUri = '';
var dbPort = '';
var config = '';
if (process.env.NODE_ENV === 'production') {
	console.log("Starting on production");
  dbURI  = process.env.MONGOLAB_URI,
 	dbPort = process.env.PORT;
}
else {
	console.log("Starting locally");
	config = require('./config'),
	dbURI  = config.database,
	dbPort = config.port;
}
mongoose.connect(dbURI);

// location of static files
app.use(express.static(__dirname + '/public'));



// ==============================================
// ROUTING
// ==============================================

// for host/api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);


// send users to front end
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});



// ==============================================
// SERVER START
// ==============================================
app.listen(dbPort);
console.log('Starting on port ' + dbPort);

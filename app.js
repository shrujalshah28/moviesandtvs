const express 		= require('express'),
	bodyParser 		= require('body-parser'),
	cookieParser 	= require('cookie-parser'),
	favicon 		= require('serve-favicon'),
	logger 			= require('morgan'),
	path 			= require('path');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));

// body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie parser setup
app.use(cookieParser());

// static content
app.use(express.static(path.join(__dirname, 'public')));

// routes
const index = require('./routes/index');
app.use('/', index);

// server port
const port = process.env.PORT || '3000';
app.set('port', port);

app.listen(port, function () {
	console.log(`Yes, I am listing on port ${port}, You want to say something...`);
});
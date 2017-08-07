const express 		= require('express'),
	bodyParser 		= require('body-parser'),
	logger 			= require('morgan'),
	Trakt 			= require('trakt.tv'),
	traktImages 	= require('trakt.tv-images'),
	path 			= require('path');

let app = express();

app.use(logger('dev'));

// body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// trakt.tv configuration
let options = {
	client_id: '75a472dc626af40fc1652025ff98e07d7cbe62728fc65a22da77bb6917c5c4f2',
	client_secret: '619cfe00b5d2c8c31c44618e9c21b92e59e5940e5ab80d1a0a6f3d03d9077d98',
	redirect_uri: 'https://moviesandtvs.herokuapp.com/',   // defaults to 'urn:ietf:wg:oauth:2.0:oob'
	api_url: 'https://api-staging.trakt.tv',        // defaults to 'https://api.trakt.tv'
	useragent: null,      // defaults to 'trakt.tv/<version>'
	pagination: true,     // defaults to false, global pagination (see below)
	debug: true,
	plugins: {
		images: traktImages
	},
	options: {
        images: {
            // fanartApiKey: 'dd363280b203e297e060b3fc5f1eab0a',
            tvdbApiKey: '20EC6BC5EB9AF4BD',
            smallerImages: false
        }
    }
};

const trakt = new Trakt(options, true);

app.get('/search/:q', (req, res, next) => {
	let query = req.params.q;
	let options = {query: query};
	trakt.search.text(options).then(data => {
		res.status(200).json(data);
	}).catch(console.log);
});

app.post('/image/:q', (req, res, next) => {
	let query = req.params.q;
	let type = req.body.type;
	let id = req.body.id;
	let idType = req.body.idType;
	let options = {
		type
	};
	options[idType] = id;
	trakt.images.get(options).then(data => {
		data.name = query;
		res.status(200).json(data);
	}).catch(console.log);
});

// server port
const port = process.env.SERVERPORT || '4000';
app.set('port', port);

app.listen(port, function () {
	console.log(`Yes, I am listing on port ${port}, You want to say something...`);
});
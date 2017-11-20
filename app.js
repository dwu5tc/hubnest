var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	pg = require('pg'),
	app = express(),
	urlencodedParser = bodyParser.urlencoded({ extended: false }),
	jsonParser = bodyParser.json();

// var connect = '';
var Pool = pg.Pool;
var	Client = pg.Client;

var pool = new Pool({
	user: 'dxwu55',
	host: 'database.server.com',
	database: 'hubnest',
	password: 'hubnest',
	port: 5432,
});

pool.query('SELECT NOW()', function(err, res) {
	console.log(err, res);
	pool.end();
});

app.use(express.static('public')); // defaults to serving index.html (for static pages)
app.use(jsonParser); // ???
app.use(urlencodedParser); // ???

app.get('/add', function(req, res) {

});

app.delete('/phone/:id', function(req, res) {
	// delete phone
	res.sendStatus(200); 
});

app.delete('/person/:id', function(req, res) {
	// delete person + related info
	res.send(200);
});

app.listen(3000, function() {
	console.log('LOP 3000');
});

/* SELECT people.id, people.name, phone_nums.id, phone_nums.people_id, phone_nums.number, phone_nums.phone_types_id, phone_types.id, phone_types.type
FROM people
INNER JOIN phone_nums
ON people.id = phone_nums.people_id
INNER JOIN phone_types
ON phone_nums.phone_types_id = phone_types.id; */

/* SELECT pl.id, pl.name, pn.id, pn.people_id, pn.number, pn.phone_types_id, pt.id, pt.type
FROM people pl
INNER JOIN phone_nums pn
ON pl.id = pn.people_id
INNER JOIN phone_types pt
ON pn.phone_types_id = pt.id; */

/*INSERT INTO phone_nums(people_id, "number", phone_types_id)
VALUES (2, '6479208491', 3); */
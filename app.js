var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	pg = require('pg'),
	app = express(),
	urlencodedParser = bodyParser.urlencoded({ extended: false }),
	jsonParser = bodyParser.json();

var Pool = pg.Pool;
// var	Client = pg.Client;

var pool = new Pool({
	user: 'dxwu55',
	host: 'localhost',
	database: 'hubnest',
	password: 'hubnest',
	port: 5432
});

app.use(express.static('public')); // defaults to serving index.html (for static pages)
app.use(jsonParser); // ???
app.use(urlencodedParser); // ???

app.get('/data', function(req, res) {
	var text = 'SELECT pl.id, pl.name, pn.number, pt.type ' +
				'FROM people pl ' +
				'LEFT OUTER JOIN phone_nums pn ' +
				'ON pl.id = pn.people_id ' +
				'LEFT OUTER JOIN phone_types pt ' +
				'ON pn.phone_types_id = pt.id';

	pool.query(text, function(error, result) {
		if (error) {
			// handle
			return;
		}
		else {
			res.json(result.rows);
		}
	});
});

app.post('/person', function(req, res) {
	var newPerson = req.body; // form submitted data can be accessed through req.body

	var text = 'INSERT INTO people ' +
			'VALUES($1) ' +
			'RETURNING id';
	var values = [newPerson.name];

	pool.query(text, values, function(error, result) {
		if (error) {
			// handle 
			return;
		}
		else {
			var data = {
				id: result.rows[0].id,
				name: newPerson.name
			};
			res.status(201).json(data);
		}
	});
});

app.post('/phone/:id', function(req, res) {
	var newPhone = req.body;

	var text = 'INSERT INTO phone_nums(people_id, "number", phone_types_id) ' +
				'VALUES ($1, $2, $3);';
	var values = [newPhone.pId, newPhone.number, newPhone.type];

	pool.query(text, values, function(error, result) {
		if (error) {
			console.log(error.stack);
		}
		else {
			res.status(201).json(newPhone);
		}
	});
});

app.delete('/phone/:id', function(req, res) {
	// var text = 'INSERT INTO phone_nums(people_id, "number", phone_types_id) ' +
	// 			'VALUES ($1, $2, $3);';
	// var values = [newPhone.pId, newPhone.number, newPhone.type];

	pool.query(text, values, function(error, result) {
		if (error) {
			console.log(error.stack);
		}
		else {
			res.status(201).json(newPhone);
		}
	});
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
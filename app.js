var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	pg = require('pg'),
	app = express(),
	urlencodedParser = bodyParser.urlencoded({ extended: false }),
	jsonParser = bodyParser.json();

var Pool = pg.Pool;

var pool = new Pool({
	user: 'dxwu55',
	host: 'localhost',
	database: 'hubnest',
	password: 'hubnest',
	port: 5432
});

app.use(express.static('public'));
app.use(jsonParser);
app.use(urlencodedParser);

app.get('/data', function(req, res) {
	var text = 'SELECT pl.id, pl.name, pn.number, pn.id pnid, pt.type ' +
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
	var newPerson = req.body;

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

app.post('/phone', function(req, res) {
	var newPhone = req.body;

	var text = "SELECT id " +
				"FROM phone_types " +
				"WHERE type = '" + newPhone.type + "'";

	pool.query(text, function(error, result) {
		if (error) {
			// handle
			return;
		}
		else {
			text = 'INSERT INTO phone_nums(people_id, "number", phone_types_id) ' +
					'VALUES ($1, $2, $3) ' +
					'RETURNING id';
			var values = [newPhone.pId, newPhone.number, result.rows[0].id];

			// implement as promises maybe???
			pool.query(text, values, function(error, result) {
				if (error) {
					// handle
					return;
				}
				else {
					var data = {
						id: result.rows[0].id,
						type: newPhone.type,
						number: newPhone.number
					};
					res.status(201).json(data);
				}
			});
		}
	});
});

app.delete('/phone/:id', function(req, res) {
	var id = req.params.id;

	var text = "DELETE FROM phone_nums " +
				"WHERE id = '" + id + "'";

	pool.query(text, function(error, result) {
		if (error) {
			// handle
			return;
		}
		else {
			res.sendStatus(200); 
		}
	});
});

app.delete('/person/:id', function(req, res) {
	var id = req.params.id;

	var text = "DELETE FROM phone_nums " +
				"WHERE people_id = '" + id + "'";

	pool.query(text, function(error, result) {
		if (error) {
			// handle
			return;
		}
		else {
			text = "DELETE FROM people " +
						"WHERE id = '" + id + "'";

			pool.query(text, function(error, result) {
				if (error) {
					// handle
					return;
				}
				else {
					res.sendStatus(200); 
				}
			});
		}
	});
});

app.listen(3000, function() {
	console.log('LOP 3000');
});

// SELECT pl.id, pl.name, pn.number, pn.id, pt.type
// FROM people pl
// LEFT OUTER JOIN phone_nums pn
// ON pl.id = pn.people_id
// LEFT OUTER JOIN phone_types pt
// ON pn.phone_types_id = pt.id;
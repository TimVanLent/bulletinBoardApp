var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var pg = require('pg');
var connectionString = 'postgres://' + process.env.POSTGRES_USER + '@localhost/classexample';
console.log(connectionString);
var Sequelize = require('sequelize');
var sequelize = new Sequelize('classexample', 'timvanlent', null, {
	host: 'localhost',
	dialect: 'postgres'
});
var Message = sequelize.define('message', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
}, {
	timestamps: false
});


app.set('views', './src/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	res.render('index')
});

console.log("hello")
app.post('/', bodyParser.urlencoded({
		extended: true
	}),
	function(req, res) {

		pg.connect(connectionString, function(err, client, done) {
			if (err) {
				if (client) {
					done(client);
				}
				return;
			}
			

			sequelize.sync().then(function() {
				Message.create({
					title: req.body.titel,
					body: req.body.bodie
				})
				res.redirect('messages')
			});


		});
	});



app.get('/messages', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}
		client.query('select * from messages', function(err, result) {
			if (err) {
				done(client);
				return;
			} else {
				done();
			}
			console.log('gotta gitget');
			console.log(result.rows);


			res.render('messages', {
				messages: result.rows
			});

		});


	});
});
var server = app.listen(3000);
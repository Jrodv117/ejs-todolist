const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

var items = ['groceries', 'cook', 'eat'];

app.get('/', (req, res) => {
	var today = new Date();
	var options = { weekday: 'long', day: 'numeric', month: 'long' };
	var day = today.toLocaleDateString('en-us', options);

	res.render('list', { kindOfDay: day, newListItems: items });
});

app.post('/', (req, res) => {
	var item = req.body.listItem;
	items.push(item);
	res.redirect('/');
});

app.listen(3000, () => {
	console.log('run server, run');
});

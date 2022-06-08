const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let items = ['groceries', 'cook', 'eat'];

app.get('/', (req, res) => {
	let today = new Date();
	let options = { weekday: 'long', day: 'numeric', month: 'long' };
	let day = today.toLocaleDateString('en-us', options);

	res.render('list', { kindOfDay: day, newListItems: items });
});

app.post('/', (req, res) => {
	let item = req.body.listItem;
	items.push(item);
	res.redirect('/');
});

app.listen(3000, () => {
	console.log('run server, run');
});

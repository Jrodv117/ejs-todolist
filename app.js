const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let items = ['groceries', 'cook', 'eat'];
let workItems = [];

app.get('/', (req, res) => {
	let today = new Date();
	let options = { weekday: 'long', day: 'numeric', month: 'long' };
	let day = today.toLocaleDateString('en-us', options);

	res.render('list', { listTitle: day, newListItems: items });
});

app.post('/', (req, res) => {
	let item = req.body.listItem;
	if (req.body.list === 'Work') {
		workItems.push(item);
		res.redirect('/work');
	} else {
		items.push(item);
		res.redirect('/');
	}
});

app.get('/work', (req, res) => {
	res.render('list', { listTitle: 'Work To-Do List', newListItems: workItems });
});

app.listen(3000, () => {
	console.log('run server, run');
});

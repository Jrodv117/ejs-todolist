const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = {
	name: String,
};

const Item = mongoose.model(
	'Item', itemsSchema
)

const item1 = new Item ({
	name: "welcome",
})

const item2 = new Item ({
	name: "+ will add a new item",
})

const item3 = new Item ({
	name: "<-- delete item",
})

const defaultItems = [item1, item2, item3];


app.get('/', (req, res) => {
	Item.find({}, (err, foundItems)=> {
		if (foundItems.length === 0){
			Item.insertMany(defaultItems, (err) => {
				if(!err){
					console.log('success')
				} else{
					console.log(err)
				}
			res.redirect('/');
			})
		}else {
				res.render('list', { listTitle: day, newListItems: foundItems });
		}
	})			
	let day = date();
});

app.post('/', (req, res) => {
	const itemName = req.body.listItem;

	const item = new Item({
		name: itemName
	})

	item.save();

	res.redirect('/');

});

app.get('/work', (req, res) => {
	res.render('list', { listTitle: 'Work To-Do List', newListItems: workItems });
});

app.listen(3000, () => {
	console.log('run server, run');
});

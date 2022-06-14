const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(
	'mongodb+srv://jrodr113:lovesosa4@cluster0.vnvfl.mongodb.net/?retryWrites=true&w=majority'
);

const itemsSchema = {
	name: String,
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
	name: 'welcome',
});

const item2 = new Item({
	name: '+ will add a new item',
});

const item3 = new Item({
	name: '<-- delete item',
});

const defaultItems = [item1, item2, item3];

const listSchema = {
	name: String,
	items: [itemsSchema],
};

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
	Item.find({}, (err, foundItems) => {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, (err) => {
				if (!err) {
					console.log('success');
				} else {
					console.log(err);
				}
				res.redirect('/');
			});
		} else {
			res.render('list', { listTitle: 'Today', newListItems: foundItems });
		}
	});
});

app.get('/:customListName', (req, res) => {
	const customListName = _.capitalize(req.params.customListName);
	List.findOne({ name: customListName }, (err, match) => {
		if (!err) {
			if (!match) {
				const list = new List({
					name: customListName,
					items: defaultItems,
				});
				list.save();
				res.redirect('/' + customListName);
			} else {
				res.render('list', {
					listTitle: match.name,
					newListItems: match.items,
				});
			}
		}
	});
});

app.post('/', (req, res) => {
	const itemName = req.body.listItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName,
	});

	if (listName === 'Today') {
		item.save();
		res.redirect('/');
	} else {
		List.findOne({ name: listName }, (err, foundList) => {
			foundList.items.push(item);
			foundList.save();
			res.redirect('/' + listName);
		});
	}
});

app.post('/delete', (req, res) => {
	const box = req.body.deleteItem;
	const listName = req.body.listName;

	if (listName === 'Today') {
		Item.findByIdAndRemove(box, function (err) {
			if (!err) {
				res.redirect('/');
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: box } } },
			function (err, foundList) {
				if (!err) {
					res.redirect('/' + listName);
				}
			}
		);
	}
});

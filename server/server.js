'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('../src/models/item.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://jfleetham:asd123@ds149593.mlab.com:49593/expense-tracker');

const PORT = process.env.PORT || 3000;


app.get('/api', (req, res) => {
  res.json({ message: 'API Initalized! '});
})

//adding the /comments route to our /api router
app.get('/api/items', (req, res) => {
    Item.find(function(err, items) {
        if (err)
            res.send(err);
        //responds with a json object of our database comments.
        res.json(items)
    });
})
app.post('/api/items', (req, res) => {
    const item = new Item();
    //body parser lets us use the req.body
    item.type = req.body.type;
    item.note = req.body.note;
    item.price = req.body.price;
    item.date = req.body.price;
    item.subtraction = req.body.subtraction;
    item.save(function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'Item successfully added!'
        });
    });
});

app.delete('/api/items/:item_id', (req, res) => {
  Image.remove({
    _id: req.params.image_id
  }, function(err, image) {
    if (err)
      res.send(err);
    res.json({
      message: 'Image has been deleted'
    })
  })
});

app.listen(PORT);
console.log('Listening on localhost:3333');

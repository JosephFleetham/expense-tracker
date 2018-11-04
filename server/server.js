'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('../src/models/item.js');
const Total = require('../src/models/total.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://jfleetham:asd123@ds149593.mlab.com:49593/expense-tracker');

const PORT = process.env.PORT || 8080;


app.get('/api', (req, res) => {
  res.json({ message: 'API Initalized! '});
})

app.get('/api/items', (req, res) => {
    Item.find(function(err, items) {
        if (err)
            res.send(err);
        res.json(items)
    });
})

app.get('/api/total', (req, res) => {
    Total.find(function(err, items) {
        if (err)
            res.send(err);
        res.json(items)
    });
})

app.post('/api/items', (req, res) => {
    const item = new Item();
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

app.post('/api/total', (req, res) => {
    const total = new Total();
    item.total = req.body.total;
    item.save(function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'Total successfully added!'
        });
    });
});

app.put('/api/total/:total_id', (req, res) => {
  Total.findById(req.params.total_id, function(err, total) {
    if (err)
      res.send(err);s
    total.save(function(err) {
      if (err)
        res.send(err);
      res.json({
        message: 'Total has been updated'
      });

    });
  });
});

app.delete('/api/items/:item_id', (req, res) => {
  Item.remove({
    _id: req.params.item_id
  }, function(err, item) {
    if (err)
      res.send(err);
    res.json({
      message: 'Image has been deleted'
    })
  })
});


app.listen(PORT);
console.log('Listening on localhost:8080');

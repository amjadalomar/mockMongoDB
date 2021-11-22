const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const uri = "mongodb+srv://first-user:2kS2Dr0nQTrLPkBW@mockdb.kbrxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(uri)
.then(client => {
  console.log('Connected to Database');
  //const db = client.db("sample_airbnb");
  const collection = client.db("sample_airbnb").collection("listingsAndReviews");

  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static('public'));

  //READ kind of 
  app.get('/', (req, res) => {
    collection.find({author: {$in: ["Amjad", "Amjad Al-Omar", "Darth Vadar", "Yoda", "Darth Vader"]}}).toArray()
    .then(results => {
      res.render('index.ejs', { recipes: results });
      console.log(results);
    })
    .catch(error => console.error(error));
  });

  //CREATE
  app.post('/recipes', (req, res) => {
    collection.insertOne(req.body)
    .then(result => {
      res.redirect('/');
      console.log(`Inserted: ${req.body}`);
    })
    .catch(error => console.error(error));
  });

  //UPDATE
  app.put('/recipes', (req, res) => {
    collection.findOneAndUpdate(
      { author: 'Yoda' },
      {
        $set: {
          author: req.body.author,
          title: req.body.title
        }
      },
      {
        upsert: true
    })
    .then(result => res.json('Success'))
    .catch(error => console.error(error));
  });

  //DELETE
  app.delete('/recipes', (req, res) => {
      collection.deleteOne(
        { author: req.body.author }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

  app.listen(3000, function() {
    console.log('listening on 3000')
  });

})
.catch(error => console.error(error));


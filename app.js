// const express = require('express');
// const bodyParser= require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const app = express();
// const uri = "mongodb+srv://first-user:2kS2Dr0nQTrLPkBW@mockdb.kbrxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// MongoClient.connect(uri)
// .then(client => {
//   console.log('Connected to Database');
//   //const db = client.db("sample_airbnb");
//   const collection = client.db("sample_airbnb").collection("listingsAndReviews");

//   app.set('view engine', 'ejs');
//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(bodyParser.json());
//   app.use(express.static('public'));

//   //READ kind of 
//   app.get('/', (req, res) => {
//     collection.find({author: {$in: ["Amjad", "Amjad Al-Omar", "Darth Vadar", "Yoda", "Darth Vader"]}}).toArray()
//     .then(results => {
//       res.render('index.ejs', { recipes: results });
//       console.log(results);
//     })
//     .catch(error => console.error(error));
//   });

//   //CREATE
//   app.post('/recipes', (req, res) => {
//     collection.insertOne(req.body)
//     .then(result => {
//       res.redirect('/');
//       console.log(`Inserted: ${req.body}`);
//     })
//     .catch(error => console.error(error));
//   });

//   //UPDATE
//   app.put('/recipes', (req, res) => {
//     collection.findOneAndUpdate(
//       { author: 'Yoda' },
//       {
//         $set: {
//           author: req.body.author,
//           title: req.body.title
//         }
//       },
//       {
//         upsert: true
//     })
//     .then(result => res.json('Success'))
//     .catch(error => console.error(error));
//   });

//   //DELETE
//   app.delete('/recipes', (req, res) => {
//       collection.deleteOne(
//         { author: req.body.author }
//       )
//         .then(result => {
//           if (result.deletedCount === 0) {
//             return res.json('No quote to delete')
//           }
//           res.json('Deleted Darth Vadar\'s quote')
//         })
//         .catch(error => console.error(error))
//     })

//   app.listen(3000, function() {
//     console.log('listening on 3000')
//   });

// })
// .catch(error => console.error(error));

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Recipe = require('./models/recipes.js');

mongoose.connect('mongodb://localhost:27017/MockDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//DEFAULT
app.get('/', (req, res) => {
    res.render('home');
});

//EXPLORE/ALL RECIPES
app.get('/recipes', async (req, res) => {
    const campgrounds = await Recipe.find({});
    res.render('recipes/explore', { recipes })
});
//END OF EXPLORE

//CREATE
app.get('/recipes/create', (req, res) => {
    res.render('recipes/create');
})

app.post('/recipes', async (req, res) => {
    const recipe = new Recipe(req.body.recipe);
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`)
})
//END OF CREATE

//READ
app.get('/recipes/:id', async (req, res,) => {
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/view', { recipe });
});
//END OF READ

//UPDATE
app.get('/recipes/:id/edit', async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/edit', { recipe });
})

app.put('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, { ...req.body.recipe });
    res.redirect(`/recipes/${recipe._id}`)
});
//END OF UPDATE

//DELETE
app.delete('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.redirect('/recipes');
});
//END OF DELETE

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
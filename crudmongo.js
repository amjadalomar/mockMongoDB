const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/";

//Create/Insert into DB
function insert(recipe)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("MockDB");
    
    dbo.collection("recipes").insertOne(recipe, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}

//Read/View recipe from DB
function read()
{

}

//Update recipe from DB
function update()
{

}

//Delete Recipe from DB
function remove()
{

}
const { MongoClient } = require('mongodb');
//this is going to have to be a more formal user and the password needs to be hidden maybe using process.env
const uri = "mongodb+srv://first-user:2kS2Dr0nQTrLPkBW@mockdb.kbrxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);
//this will be replaced with 'recipeDB'     and either 'users' or 'recipes'
const database = client.db("sample_airbnb").collection("listingsAndReviews")

async function main() {
    try{
        await client.connect();
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

//main().catch(console.error);

//CREATE method
async function createRecipe(newRecipe) {

    try{
        await client.connect();
        //i think for this 
        const result = await database.insertOne(newRecipe);
        console.log(`new listing created with id: ${result.insertedId}`);
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
    

    

}

main().catch(console.error);

//create many method
async function createMultipleRecipes(newRecipes) {

    const result = await database.insertMany(newRecipes);

    console.log(`${result.insertedCount} new listings created with the following id(s): `);
    console.log(result.insertedIds);

}

//READ recipe (find one recipe/view recipe)
//this is used for when a recipe card is clicked and you are viewing the current recipe
async function findRecipe(recipeId) {

    try{
        await client.connect();

        const result = await database.findOne({_id: recipeId});

        if(result)
        {
            console.log(`found a recipe in the collection`);
            console.log(result);
        }
        else{
            console.log(`No recipe found`);
        }
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
    
}

//this is used more for search queries and filtering
async function findManyRecipes({minNumBeds = 0, minNumBaths = 0, maxNumResults = Number.MAX_SAFE_INTEGER} = {}) {

    const cursor = database.find({bedrooms: {$gte: minNumBeds}, bathrooms: {$gte: minNumBaths}}).sort({ last_review: -1}).limit(maxNumResults);

    const results = await cursor.toArray();

    console.log(results);

}

//UPDATE recipe
async function updateRecipe(recipeId, updatedRecipe) {

    try{
        await client.connect();

        const result = await database.updateOne({_id: recipeId}, {$set: updatedRecipe});

        console.log(`${result.matchedCount} documents matched query criteria`);
        console.log(`${result.modifiedCount} documents were updated`);
        console.log(result);
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

//update/insert if not found
async function upsertRecipeByName(nameOfRecipe, updatedRecipe) {

    const result = await database.updateOne({name: nameOfRecipe}, {$set: updatedRecipe}, {upsert: true});

    console.log(`${result.matchedCount} documents matched criteria`);

    if(result.upsertedCount > 0) {
        console.log(`one doc was inserted with id of ${result.upsertedId}`);
    }
    else {
        console.log(`${result.modifiedCount} documents were updated`);
    }

}

//updating many
async function updateManyRecipes() {

    const result = await database.updateMany({property_type: {$exists: false}}, {$set: {property_type: "Unknown"}});

    console.log(`${result.matchedCount} documents matched query criteria`);
    console.log(`${result.modifiedCount} documents were updated`);

}

//DELETE recipe
async function deleteRecipe(recipeId) {

    try{
        await client.connect();

        const result = await database.deleteOne({_id: recipeId});

        console.log(`${result.deletedCount} documents were deleted`);
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

//delete many
async function deleteManyRecipes(date) {

    const result = await database.deleteMany({"last_scraped": {$lt: date}});

    console.log(`${result.deletedCount} documentes were deleted`);

}

async function listDatabases() {
    const databasesList = await client.db().admin().listDatabases();

    console.log(`Databases: `);

    databasesList.databases.forEach(db => {
        console.log(`-${db.name}`);
    });
}

module.exports = { createRecipe, findRecipe, updateRecipe, deleteRecipe};
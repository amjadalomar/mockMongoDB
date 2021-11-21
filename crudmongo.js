const { MongoClient } = require('mongodb');
//this is going to have to be a more formal user and the password needs to be hidden maybe using process.env
const uri = "mongodb+srv://first-user:2kS2Dr0nQTrLPkBW@mockdb.kbrxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);
//this will be replaced with recipeDB and either 'users' or 'recipes'
const database = client.db("sample_airbnb").collection("listingsAndReviews")

async function main() {

    


    try{
        await client.connect();

        //await deleteManyListings(client, new Date("2019-02-15"));

        //await deleteListing(client, "cozy cottage");

        //await updateManyListings(client);

        //await upsertListingByName(client, "cozy cottage", {bedrooms: 3, beds: 2, bathrooms: 40, name: "cozy cottage"});

        //await updateListingByName(client, "lovely loft", {bedrooms: 60, beds: 90});

        //await findManyListings(client, {minNumBeds: 3, minNumBaths: 3, maxNumResults: 5});

        //await findOneListingByName(client, "lovely loft");
        
        // await createMultipleListings(client, [
        // {
        //     name: "infifnifn",
        //     bedrooms: 2,
        //     bathrooms: 4,
        //     summary: "oeeppepepepepe"
        // },
        // {
        //     name: "hhotlelellele",
        //     bedrooms: 110101,
        //     bathrooms: 121
        // },
        // {
        //     name: "doofus",
        //     bedrooms: 3,
        //     bathrooms: 2
        // }]);

        await createRecipe(client, {
            name: "unlovely loft",
            summary: "not charming loft in paris",
            bedrooms: 10,
            bathrooms: 10
        });

        //await listDatabases(client);
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

main().catch(console.error);

//create method
async function createRecipe(client, newRecipe) {

    //this needs to be the correct database and collections

    //i think for this 
    const result = await database.insertOne(newRecipe);

    console.log(`new listing created with id: ${result.insertedId}`);

}

//create many method
async function createMultipleRecipes(client, newRecipes) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newRecipes);

    console.log(`${result.insertedCount} new listings created with the following id(s): `);
    console.log(result.insertedIds);

}

//example of find using name
async function findOneRecipeByName(client, nameOfRecipe) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfRecipe});

    if(result)
    {
        console.log(`found a listing in the collection with the name ${nameOfRecipe}`);
        console.log(result);
    }
    else{
        console.log(`No listing found with name:  ${nameOfRecipe}`);
    }
}

//find multiple with query criteria
async function findManyRecipes(client, {minNumBeds = 0, minNumBaths = 0, maxNumResults = Number.MAX_SAFE_INTEGER} = {}) {

    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({bedrooms: {$gte: minNumBeds}, bathrooms: {$gte: minNumBaths}}).sort({ last_review: -1}).limit(maxNumResults);

    const results = await cursor.toArray();

    console.log(results);

}

//update
async function updateRecipeByName(client, nameOfRecipe, updatedRecipe) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfRecipe}, {$set: updatedRecipe});

    console.log(`${result.matchedCount} documents matched query criteria`);
    console.log(`${result.modifiedCount} documents were updated`);
    console.log(result);


}

//update/insert if not found
async function upsertRecipeByName(client, nameOfRecipe, updatedRecipe) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfRecipe}, {$set: updatedRecipe}, {upsert: true});

    console.log(`${result.matchedCount} documents matched criteria`);

    if(result.upsertedCount > 0) {
        console.log(`one doc was inserted with id of ${result.upsertedId}`);
    }
    else {
        console.log(`${result.modifiedCount} documents were updated`);
    }

}

//updating many
async function updateManyRecipes(client) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({property_type: {$exists: false}}, {$set: {property_type: "Unknown"}});

    console.log(`${result.matchedCount} documents matched query criteria`);
    console.log(`${result.modifiedCount} documents were updated`);

}

//delete one document
async function deleteRecipe(client, nameOfRecipe) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({name: nameOfRecipe});

    console.log(`${result.deletedCount} documents were deleted`);

}

//delete many
async function deleteManyRecipes(client, date) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({"last_scraped": {$lt: date}});

    console.log(`${result.deletedCount} documentes were deleted`);

}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log(`Databases: `);

    databasesList.databases.forEach(db => {
        console.log(`-${db.name}`);
    });
}
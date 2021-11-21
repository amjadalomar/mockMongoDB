const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://first-user:2kS2Dr0nQTrLPkBW@mockdb.kbrxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try{
        await client.connect();

        await deleteManyListings(client, new Date("2019-02-15"));

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

        // await createListing(client, {
        //     name: "lovely loft",
        //     summary: "charming loft in paris",
        //     bedrooms: 1,
        //     bathrooms: 1
        // });

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
async function createListing(client, newListing) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`new listing created with id: ${result.insertedId}`);

}

//create many method
async function createMultipleListings(client, newListings) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listings created with the following id(s): `);
    console.log(result.insertedIds);

}

//example of find using name
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if(result)
    {
        console.log(`found a listing in the collection with the name ${nameOfListing}`);
        console.log(result);
    }
    else{
        console.log(`No listing found with name:  ${nameOfListing}`);
    }
}

//find multiple with query criteria
async function findManyListings(client, {minNumBeds = 0, minNumBaths = 0, maxNumResults = Number.MAX_SAFE_INTEGER} = {}) {

    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({bedrooms: {$gte: minNumBeds}, bathrooms: {$gte: minNumBaths}}).sort({ last_review: -1}).limit(maxNumResults);

    const results = await cursor.toArray();

    console.log(results);

}

//update
async function updateListingByName(client, nameOfListing, updatedListing) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfListing}, {$set: updatedListing});

    console.log(`${result.matchedCount} documents matched query criteria`);
    console.log(`${result.modifiedCount} documents were updated`);
    console.log(result);


}

//update/insert if not found
async function upsertListingByName(client, nameOfListing, updatedListing) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfListing}, {$set: updatedListing}, {upsert: true});

    console.log(`${result.matchedCount} documents matched criteria`);

    if(result.upsertedCount > 0) {
        console.log(`one doc was inserted with id of ${result.upsertedId}`);
    }
    else {
        console.log(`${result.modifiedCount} documents were updated`);
    }

}

//updating many
async function updateManyListings(client) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({property_type: {$exists: false}}, {$set: {property_type: "Unknown"}});

    console.log(`${result.matchedCount} documents matched query criteria`);
    console.log(`${result.modifiedCount} documents were updated`);

}

//delete one document
async function deleteListing(client, nameOfListing) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({name: nameOfListing});

    console.log(`${result.deletedCount} documents were deleted`);

}

//delete many
async function deleteManyListings(client, date) {

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
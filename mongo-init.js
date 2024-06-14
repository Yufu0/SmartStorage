const username = process.env.APP_USERNAME;
const password = process.env.APP_PASSWORD;
const collectionName = process.env.MONGO_COLLECTION_USERS;

const database = db.getSiblingDB('smartstorage');

database.createCollection(collectionName);
database.getCollection(collectionName).deleteMany({})

const filter = { username: username };

const update = {
    $setOnInsert: {
        username: username,
        password: password
    }
};

const options = { upsert: true };

database.getCollection(collectionName).updateOne(filter, update, options);
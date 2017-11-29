const mongodb = require('mongodb');
const {promisify} = require('util');

// hiding connect and db
module.exports = {
  insert, find
};

// inserts data into a collection called `${userId}/${entity}`
async function insert(userId, entity, data) {
  const connection = await getConnection();
  const collection = connection.collection(`${userId}/${entity}`);
  if (!Array.isArray(data)) {
    await collection.insertOne(data);
  } else {
    await collection.insertMany(data);
  }
}

// retrieves data from a collection called `${userId}/${entity}`
async function find(userId, entity) {
  const connection = await getConnection();
  const collection = connection.collection(`${userId}/${entity}`);
  const result = await collection.find();
  return await result.toArray();
}

// singleton db instance
let db;

// db accessor
async function getConnection() {
  if (!db) {
    const asyncConnect = promisify(mongodb.MongoClient.connect);
    db = await asyncConnect('mongodb://localhost:27017/test');
  }
  return db;
}

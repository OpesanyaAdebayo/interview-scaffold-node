const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/myapp";
const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect().then(() => { console.log('database connected') });
const db = client.db('test').collection('test')

const sessionCollection = client.db('test').collection('test');

module.exports = { db, sessionCollection };

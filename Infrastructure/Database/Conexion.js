const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, { useUnifiedTopology: true });

let dbInstance = null;

async function EUrbana() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    dbInstance = client.db(dbName);
    console.log("Conectado a eurbana_data en MongoDB");
    return dbInstance;
  } catch (error) {
    console.error("Error al conectar a eurbana_data en MongoDB", error);
    throw error;
  }
}

module.exports = { EUrbana };

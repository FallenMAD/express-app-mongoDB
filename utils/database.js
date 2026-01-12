import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://roman:${process.env.DB_PASSWORD}@cluster0.sdvrrdi.mongodb.net/?retryWrites=true&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

export async function connectToDatabase() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB Atlas!');

    db = client.db('shop'); // <-- назва твоєї бази
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('❌ Database not initialized!');
  }
  return db;
}

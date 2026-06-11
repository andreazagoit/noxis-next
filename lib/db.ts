import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not set')
}

/* Client cached su globalThis: in dev l'HMR ricarica i moduli e senza cache
   si aprirebbe una connessione nuova a ogni modifica. */
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient }

const client = globalForMongo._mongoClient ?? new MongoClient(uri)
if (process.env.NODE_ENV !== 'production') {
  globalForMongo._mongoClient = client
}

export const db = client.db('noxis')

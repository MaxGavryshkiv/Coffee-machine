import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

export const getMongoUri = async () => {
  mongo = await MongoMemoryServer.create();
  return mongo.getUri();
};

export const stopMongo = async () => {
  if (mongo) {
    await mongo.stop();
  }
};

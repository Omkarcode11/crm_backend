let mongoose = require('mongoose')
let { MongoMemoryServer } = require('mongodb-memory-server');


let mongod;

module.exports.connect = async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create()
    let uri = mongod.getUri()
    let mongoConfig = {
      maxPoolSize: 10,
      useUnifiedTopology: true
    }
    mongoose.connect(uri, mongoConfig)
  }
}


module.exports.closeDB = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if (mongod) {
    await mongod.stop()
  }
}

module.exports.clearDB = async () => {
  let collections = await mongoose.connection.collections
  for (let c in collections) {
    let coll = collections[c]
    await coll.deleteMany()
  }
}

































































// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

// let mongod;

// module.exports.connect = async () => {
//   if (!mongod) {
//     mongod = await MongoMemoryServer.create();
//     const uri = mongod.getUri();
//     const mongoConfig = {
//       maxPoolSize: 10,
//       useUnifiedTopology: true,
//     };
//     mongoose.connect(uri, mongoConfig);
//   }
// };

// module.exports.closeDB = async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   if (mongod) {
//     await mongod.stop();
//   }
// };

// module.exports.clearDB = async () => {
//   let collections = await mongoose.connection.collections;
//   for (let c in collections) {
//     let collection = collections[c];
//     await collection.deleteMany();
//   }
// };

const Promise = require("bluebird")
const mongodb = require("mongodb")
const {mongoHost, mongoPort, mongoUser, mongoPwd, mongoDatabase} = require("config")

const dbOpts = {
  promiseLibrary: Promise,
  useUnifiedTopology: true,
}

let dbInstance

module.exports = function getDb() {
  if (!dbInstance) {
    let authentication = ""
    if (mongoUser && mongoPwd) {
      authentication = `${mongoUser}:${mongoPwd}@`
    }

    const uri = `mongodb://${authentication}${mongoHost}:${mongoPort}`
    return mongodb.MongoClient.connect(uri, dbOpts).then((client) => {
      console.log("Connected to db")
      dbInstance = client.db(mongoDatabase)
      return dbInstance
    }).catch((err) => {
      console.error("Error connecting to db", err)
      process.exit(1)
    })
  }

  return Promise.resolve(dbInstance)
}

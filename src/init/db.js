const Promise = require("bluebird")
const mongodb = require("mongodb")
const {mongoHost, mongoPort, mongoUser, mongoPwd, mongoDatabase} = require("config")

const dbOpts = {
  promiseLibrary: Promise,
}

let dbInstance

module.exports = function getDb() {
  if (!dbInstance) {
    let authentication = ""
    if (mongoUser && mongoPwd) {
      authentication = `${mongoUser}:${mongoPwd}@`
    }

    const uri = `mongodb://${authentication}${mongoHost}:${mongoPort}/${mongoDatabase}`
    return mongodb.MongoClient.connect(uri, dbOpts).then((db) => {
      console.log("Connected to db")
      dbInstance = db
      return dbInstance
    }).catch((err) => {
      console.error("Error connecting to db", err)
      process.exit(1)
    })
  }

  return Promise.resolve(dbInstance)
}

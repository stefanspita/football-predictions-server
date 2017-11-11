const {map} = require("ramda")
const getDb = require("../../init/db")
const calculatePlayerRatings = require("./calculate-player-ratings")

function generateReport() {
  return getDb().then((db) => {
    const teamsCollection = db.collection("teams")
    const playersCollection = db.collection("players")
    return Promise.all([
      teamsCollection.find().project({_id: 0}).toArray(),
      playersCollection.find().project({_id: 0}).toArray(),
    ])
  }).spread((teams, players) => {
    return Promise.all([
      map(calculatePlayerRatings, players),
    ])
  }).then(() => {
    console.log("FINISHED COMPILING PLAYER REPORT")
    process.exit(0)
  }).catch((err) => {
    console.error("ERROR OCCURRED", err)
    process.exit(1)
  })
}

generateReport()

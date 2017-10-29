const getDb = require("../../init/db")
const teams = require("./teams")
const players = require("./players")

function updateTeams(db, teams) {
  const teamsCollection = db.collection("teams")
  return teamsCollection.deleteMany().then(() => {
    return teamsCollection.insertMany(teams).then(() => {
      return teamsCollection.createIndex({id: 1}, {unique: true})
    })
  })
}

function updatePlayers(db, players) {
  const playersCollection = db.collection("players")
  return playersCollection.deleteMany().then(() => {
    return playersCollection.insertMany(players).then(() => {
      return playersCollection.createIndex({id: 1}, {unique: true})
    })
  })
}

function runInitDb() {
  return getDb().then((db) => {
    return Promise.all([
      updateTeams(db, teams),
      updatePlayers(db, players),
    ])
  }).then(() => {
    console.log("FINISHED UPDATING DB")
    process.exit(0)
  }).catch((err) => {
    console.err("ERROR OCCURRED", err)
    process.exit(1)
  })
}

runInitDb()

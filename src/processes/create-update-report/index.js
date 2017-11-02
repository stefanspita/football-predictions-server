const Promise = require("bluebird")
const {map, tail} = require("ramda")
const fs = require("fs-extra")
const getDb = require("../../init/db")

function getTeamUpdateReport(db, gameweek) {
  function mapTeamToReport(team) {
    team.gwToUpdate = gameweek
    team.fixtures = tail(team.fixtures)
    return team
  }

  const teamsCollection = db.collection("teams")
  return teamsCollection.find({lastUpdatedGw: {$lt: gameweek}}).project({_id: 0}).toArray()
    .then(map(mapTeamToReport))
    .then(teamReport => fs.writeJson("./teams-update.json", teamReport))
}

function getPlayerUpdateReport(db, gameweek) {
  function mapPlayerToReport(player) {
    player.gwToUpdate = gameweek
    player.price = 0
    player.minutes = 0
    player.points = 0
    player.bps = 0
    return player
  }

  const playersCollection = db.collection("players")
  return playersCollection.find({lastUpdatedGw: {$lt: gameweek}})
    .project({_id: 0, id: 1, name: 1, lastUpdatedGw: 1}).toArray()
    .then(map(mapPlayerToReport))
    .then(playerReport => fs.writeJson("./players-update.json", playerReport))
}

function createUpdateReport(gameweek) {
  return getDb().then((db) => {
    if (!gameweek) throw new Error("Missing gameweek argument")

    return Promise.all([
      getTeamUpdateReport(db, gameweek),
      getPlayerUpdateReport(db, gameweek),
    ])
  }).then(() => {
    console.log("FINISHED COMPILING UPDATE REPORT")
    process.exit(0)
  }).catch((err) => {
    console.error("ERROR OCCURRED", err)
    process.exit(1)
  })
}

createUpdateReport(parseInt(process.argv[2], 10))

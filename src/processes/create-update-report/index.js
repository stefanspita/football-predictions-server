const Promise = require("bluebird")
const {map} = require("ramda")
const fs = require("fs-extra")
const getDb = require("../../init/db")

function getTeamUpdateReport(db, gameweek) {
  function mapTeamToReport(team) {
    team.gwToUpdate = gameweek
    team.newFixtureDifficulty = ""
    return team
  }

  const teamsCollection = db.collection("teams")
  return teamsCollection.find({lastUpdatedGw: {$lt: gameweek}}).project({_id: 0, fixtures: 0}).toArray()
    .then(map(mapTeamToReport))
    .then(teamReport => fs.writeJson("./teams-update.json", teamReport))
}

function createUpdateReport(gameweek) {
  return getDb().then((db) => {
    return Promise.all([
      getTeamUpdateReport(db, gameweek),
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

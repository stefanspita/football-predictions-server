const Promise = require("bluebird")
const fs = require("fs-extra")
const {compose, find, flatten, prop, propEq} = require("ramda")
const unavailabilityReport = require("../../../injury-report.json")
const getDb = require("../../init/db")
const {getListOfTeams} = require("../../services/website")

const getTeamData = require("./get-team-data")
const getPlayerData = require("./get-player-data")

const CONCURRENCY = 5

function getTeamUpdateReport(teams) {
  return Promise.map(teams, (team) => {
    return getTeamData(team)
  }, {concurrency: CONCURRENCY}).then(teamReport => {
    return fs.writeJson("./teams-update.json", teamReport)
  })
}

function getPlayerUpdateReport(db, unavailabilityReport, gameweek, teams) {
  return Promise.map(teams, (team) => {
    const playersCollection = db.collection("players")
    const unavailablePlayers = compose(
      prop("unavailablePlayers"),
      find(propEq("teamId", team.id))
    )(unavailabilityReport)

    return getPlayerData(playersCollection, unavailablePlayers, gameweek, team)
  }, {concurrency: CONCURRENCY})
    .then((playersTeamReport) => flatten(playersTeamReport))
    .then(playerReport => {
      return fs.writeJson("./players-update.json", playerReport)
    })
}

function createUpdateReport(gameweek) {
  if (!gameweek) throw new Error("Missing gameweek argument")

  return Promise.all([
    getListOfTeams(),
    getDb(),
  ])
    .spread((teams, db) => {
      return getTeamUpdateReport(teams)
        .then(() => getPlayerUpdateReport(db, unavailabilityReport, gameweek, teams))
    })
    .then(() => {
      console.log("FINISHED FETCHING ROUND DATA")
      process.exit(0)
    }).catch((err) => {
      console.error("ERROR OCCURRED", err)
      process.exit(1)
    })
}

createUpdateReport(parseInt(process.argv[2], 10))

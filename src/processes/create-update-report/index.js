const Promise = require("bluebird")
const fs = require("fs-extra")
const {flatten} = require("ramda")
const {getListOfTeams} = require("../../services/website")
const getTeamData = require("./get-team-data")
const getPlayerData = require("./get-player-data")

const CONCURRENCY = 5

function getTeamUpdateReport(lastUpdatedGw, teams) {
  return Promise.map(teams, (team) => {
    return getTeamData(lastUpdatedGw, team)
  }, {concurrency: CONCURRENCY}).then(teamReport => {
    return fs.writeJson("./teams-update.json", teamReport)
  })
}

function getPlayerUpdateReport(lastUpdatedGw, teams) {
  return Promise.map(teams, (team) => {
    return getPlayerData(lastUpdatedGw, team)
  }, {concurrency: CONCURRENCY})
    .then((playersTeamReport) => flatten(playersTeamReport))
    .then(playerReport => {
      return fs.writeJson("./players-update.json", playerReport)
    })
}

function createUpdateReport(lastUpdatedGw) {
  if (!lastUpdatedGw) throw new Error("Missing gameweek argument")
  return getListOfTeams()
    .then((teams) => {
      const team = [teams[0]]
      return getTeamUpdateReport(lastUpdatedGw, team)
        .then(() => getPlayerUpdateReport(lastUpdatedGw, team))
    })
    .catch((err) => console.log("Error occurred", err))
}

createUpdateReport(parseInt(process.argv[2], 10))

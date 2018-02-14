const Promise = require("bluebird")
const fs = require("fs-extra")
const {flatten} = require("ramda")
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

function getPlayerUpdateReport(teams) {
  return Promise.map(teams, (team) => {
    return getPlayerData(team)
  }, {concurrency: CONCURRENCY})
    .then((playersTeamReport) => flatten(playersTeamReport))
    .then(playerReport => {
      return fs.writeJson("./players-update.json", playerReport)
    })
}

function createUpdateReport() {
  return getListOfTeams()
    .then((teams) => {
      return getTeamUpdateReport(teams)
        .then(() => getPlayerUpdateReport(teams))
    })
    .catch((err) => console.log("Error occurred", err))
}

createUpdateReport()

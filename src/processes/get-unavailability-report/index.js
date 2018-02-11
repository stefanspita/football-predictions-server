const Promise = require("bluebird")
const fs = require("fs-extra")
const {getListOfTeams} = require("../../services/website/methods")
const getUnavailablePlayersByTeam = require("./get-unavailable-players-by-team")

const CONCURRENCY = 5

function getUnavailablePlayersReport(teams) {
  return Promise.map(teams, (team) => {
    return getUnavailablePlayersByTeam(team)
  }, {concurrency: CONCURRENCY}).then(injuryReport => {
    return fs.writeJson("./injury-report.json", injuryReport)
  })
}

function createUnavailabilityReport() {
  return getListOfTeams()
    .then((teams) => getUnavailablePlayersReport(teams))
    .catch((err) => console.log("Error occurred creating unavailable players report", err))
}

createUnavailabilityReport()

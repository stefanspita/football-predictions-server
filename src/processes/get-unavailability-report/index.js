const fs = require("fs-extra")
const {getListOfTeams} = require("../../services/website")
const getUnavailablePlayersByTeam = require("./get-unavailable-players-by-team")

function getUnavailablePlayersReport(teams) {
  return getUnavailablePlayersByTeam(teams)
    .then(injuryReport => {
      return fs.writeJson("./injury-report.json", injuryReport)
    })
}

function createUnavailabilityReport() {
  return getListOfTeams()
    .then((teams) => getUnavailablePlayersReport(teams))
    .catch((err) => console.log("Error occurred creating unavailable players report", err))
}

createUnavailabilityReport()

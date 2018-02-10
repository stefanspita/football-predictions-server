const Promise = require("bluebird")
const fs = require("fs-extra")
const {getListOfTeams} = require("../../services/website/methods")
const getPlayerInjuriesByTeam = require("./get-player-injuries-by-team")

const CONCURRENCY = 5

function getPlayersInjuryReport(teams) {
  return Promise.map(teams, (team) => {
    return getPlayerInjuriesByTeam(team)
  }, {concurrency: CONCURRENCY}).then(injuryReport => {
    return fs.writeJson("./injury-report.json", injuryReport)
  })
}

function createInjuryReport() {
  return getListOfTeams()
    .then((teams) => getPlayersInjuryReport(teams))
    .catch((err) => console.log("Error occurred creating injury report", err))
}

createInjuryReport()

const fs = require("fs-extra")
const {statisticsPage, openWebsite} = require("../../services/website")
const getUnavailablePlayersByTeam = require("./get-unavailable-players-by-team")

function getUnavailablePlayersReport(session, teams) {
  return getUnavailablePlayersByTeam(session, teams)
    .then(injuryReport => {
      return fs.writeJson("./injury-report.json", injuryReport)
    })
}

function createUnavailabilityReport() {
  const session = openWebsite()
  return statisticsPage.getListOfTeams(session)
    .then((teams) => getUnavailablePlayersReport(session, teams))
    .then(() => {
      console.log("FINISHED FETCHING UNAVAILABLE PLAYERS")
      session.end()
      process.exit(0)
    }).catch((err) => {
      console.error("ERROR OCCURRED", err)
      session.end()
      process.exit(1)
    })
}

createUnavailabilityReport()

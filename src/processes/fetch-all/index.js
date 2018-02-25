const Promise = require("bluebird")
const fs = require("fs-extra")
const {flatten} = require("ramda")
const {getListOfTeams, openWebsite} = require("../../services/website")
const getTeamData = require("./get-team-data")
const getPlayerData = require("./get-player-data")

function getTeamUpdateReport(session, teams) {
  return getTeamData(session, teams)
    .then(teamReport => {
      return fs.writeJson("./teams-update.json", teamReport)
    })
}

function getPlayerUpdateReport(session, teams) {
  return Promise.mapSeries(teams, (team) => {
    return getPlayerData(session, team)
  })
    .then((playersTeamReport) => flatten(playersTeamReport))
    .then(playerReport => {
      return fs.writeJson("./players-update.json", playerReport)
    })
}

function createUpdateReport() {
  const session = openWebsite()
  return getListOfTeams(session)
    .then((teams) => {
      return getTeamUpdateReport(session, teams)
        .then(() => getPlayerUpdateReport(session, teams))
    })
    .then(() => {
      console.log("FINISHED FETCHING ALL DATA")
      session.end()
      process.exit(0)
    }).catch((err) => {
      console.error("ERROR OCCURRED", err)
      session.end()
      process.exit(1)
    })
}

createUpdateReport()

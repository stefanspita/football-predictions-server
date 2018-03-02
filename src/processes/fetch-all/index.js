const Promise = require("bluebird")
const fs = require("fs-extra")
const {flatten} = require("ramda")
const {statisticsPage, openWebsite} = require("../../services/website")
const getTeamData = require("./get-team-data")
const getPlayerData = require("./get-player-data")

const CONCURRENCY = 4

function getTeamUpdateReport(teams) {
  const session = openWebsite()
  return getTeamData(session, teams)
    .then(teamReport => {
      return fs.writeJson("./teams-update.json", teamReport)
    })
    .tap(() => session.end())
}

function getPlayerUpdateReport(teams) {
  return Promise.map(teams, (team) => {
    const session = openWebsite()
    return getPlayerData(session, team)
      .tap(() => session.end())
  }, {concurrency: CONCURRENCY})
    .then((playersTeamReport) => flatten(playersTeamReport))
    .then(playerReport => {
      return fs.writeJson("./players-update.json", playerReport)
    })
}

function createUpdateReport() {
  const session = openWebsite()
  return statisticsPage.getListOfTeams(session)
    .then((teams) => {
      return getTeamUpdateReport(teams)
        .then(() => getPlayerUpdateReport(teams))
    })
    .tap(() => session.end())
    .then(() => {
      console.log("FINISHED FETCHING ALL DATA")
      process.exit(0)
    }).catch((err) => {
      console.error("ERROR OCCURRED", err)
      process.exit(1)
    })
}

createUpdateReport()

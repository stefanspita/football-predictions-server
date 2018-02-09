const Promise = require("bluebird")
const fs = require("fs-extra")
const {getListOfTeams} = require("./website/methods")
const getTeamData = require("./get-team-data")

const CONCURRENCY = 5

function getTeamUpdateReport(lastUpdatedGw, teams) {
  return Promise.map(teams, (team) => {
    return getTeamData(lastUpdatedGw, team)
  }, {concurrency: CONCURRENCY}).then(teamReport => {
    return fs.writeJson("./teams-update.json", teamReport)
  })
}

function createUpdateReport(lastUpdatedGw) {
  if (!lastUpdatedGw) throw new Error("Missing gameweek argument")
  return getListOfTeams()
    .then((teams) => getTeamUpdateReport(lastUpdatedGw, teams))
    .catch((err) => console.log("Error occurred", err))
}

createUpdateReport(parseInt(process.argv[2], 10))

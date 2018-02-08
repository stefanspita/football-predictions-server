const Promise = require("bluebird")
const Nightmare = require("nightmare")

function openWebsite() {
  const nightmare = new Nightmare({show: true, Promise})
  return nightmare
    .goto("https://fantasy.premierleague.com/a/statistics/total_points")

}

function getFixturesForTeam(teamId) {
  return openWebsite()
    .select("#ismjs-stats-filter", teamId)
    .click(".ism-table--el__name")
    .end()
}

module.exports = {getFixturesForTeam, openWebsite}

/* global $ */
const Promise = require("bluebird")
const Nightmare = require("nightmare")
const statisticsPage = require("./statistics")
const playerDetailsModal = require("./player-details-modal")
const selectors = require("./selectors")

function openWebsite() {
  const nightmare = new Nightmare({Promise})
  return nightmare
    .goto("https://fantasy.premierleague.com/a/statistics/total_points")
    .inject("js", "node_modules/jquery/dist/jquery.min.js")
}

function getListOfTeamFixtures(session, teamId) {
  return session
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .click(selectors.PLAYER_ID)
    .wait(selectors.PLAYER_FIXTURES_TAB)
    .click(selectors.PLAYER_FIXTURES_TAB)
    .evaluate((fixturesSelector) => {
      return $(fixturesSelector)
        .filter(function() {
          return $(this).text().length !== 0
        })
        .slice(0, 5)
        .map(function() {
          return parseInt($(this).text(), 10)
        })
        .get()
    }, selectors.TEAM_FIXTURES)
}

module.exports = {
  openWebsite, statisticsPage, playerDetailsModal, getListOfTeamFixtures,
}

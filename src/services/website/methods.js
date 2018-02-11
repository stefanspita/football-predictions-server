/* global $ */
const Promise = require("bluebird")
const Nightmare = require("nightmare")
const selectors = require("./selectors")

function openWebsite() {
  const nightmare = new Nightmare({Promise})
  return nightmare
    .goto("https://fantasy.premierleague.com/a/statistics/total_points")
    .inject("js", "node_modules/jquery/dist/jquery.min.js")
}

function getListOfTeams() {
  return openWebsite()
    .evaluate((teamsSelector) => {
      return $(teamsSelector)
        .map(function() {
          return {id: $(this).attr("value"), name: $(this).text()}
        })
        .get()
    }, selectors.TEAM_OPTIONS_IN_SELECTBOX)
    .end()
}

function getListOfTeamFixtures(teamId) {
  return openWebsite()
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .click(selectors.PLAYER_ROW_ID)
    .wait(selectors.PLAYER_FIXTURES_TAB)
    .click(selectors.PLAYER_FIXTURES_TAB)
    .evaluate((fixturesSelector) => {
      return $(fixturesSelector)
        .map(function() {
          return parseInt($(this).text(), 10)
        })
        .get()
    }, selectors.NEXT_5_TEAM_FIXTURES)
    .end()
}

function getListOfUnavailablePlayers(teamId) {
  return openWebsite()
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .evaluate((unavailablePlayersSelector, playerIdSelector) => {
      return $(unavailablePlayersSelector).parents("tr").find(playerIdSelector)
        .map(function() {
          return $(this).text()
        })
        .get()
    }, selectors.UNAVAILABLE_PLAYERS, selectors.PLAYER_ROW_ID)
    .end()

}

module.exports = {getListOfTeamFixtures, getListOfTeams, getListOfUnavailablePlayers}

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
    .click(selectors.PLAYER_ID)
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
    }, selectors.UNAVAILABLE_PLAYERS, selectors.PLAYER_ID)
    .end()
}

function getListOfPlayersByTeam(teamId) {
  return openWebsite()
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .evaluate((playerIdSelector) => {
      return $(playerIdSelector)
        .map(function() {
          return $(this).text()
        })
        .get()
    }, selectors.PLAYER_ID)
    .end()
}

function getPlayerStats(session, teamId, playerIndex) {
  return session
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .click(`${selectors.PLAYER_ROW}:nth-child(${playerIndex + 1}) ${selectors.PLAYER_ID}`)
    .wait(selectors.PLAYER_NAME)
    .evaluate((selectors) => {
      const name = $(selectors.PLAYER_NAME).text()
      const position = $(selectors.PLAYER_POSITION).text()
      const price = parseFloat($(selectors.PLAYER_PRICE).text().slice(1), 10)
      const selectionPercent = parseFloat($(selectors.PLAYER_SELECTED_PERCENTAGE).text().slice(0, -1), 10)
      const previousSeasons = $(selectors.PREVIOUS_SEASONS)
        .map(function() {
          const row = $(this)
          return {
            season: row.find(selectors.PREVIOUS_SEASON_NAME).text(),
            points: parseInt(row.find(selectors.PREVIOUS_SEASON_POINTS).text(), 10),
            minutesPlayed: parseInt(row.find(selectors.PREVIOUS_SEASON_MINUTES_PLAYED).text(), 10),
            bps: parseInt(row.find(selectors.PREVIOUS_SEASON_BONUS_POINTS).text(), 10),
          }
        })
        .get()
      const currentSeason = $(selectors.CURRENT_SEASON)
        .map(function() {
          const row = $(this)
          return {
            round: parseInt(row.find(selectors.CURRENT_SEASON_ROUND).text(), 10),
            points: parseInt(row.find(selectors.CURRENT_SEASON_POINTS).text(), 10),
            minutesPlayed: parseInt(row.find(selectors.CURRENT_SEASON_MINUTES_PLAYED).text(), 10),
            bps: parseInt(row.find(selectors.CURRENT_SEASON_BONUS_POINTS).text(), 10),
          }
        })
        .get()
      return {name, position, price, selectionPercent, previousSeasons, currentSeason}
    }, selectors)
}

function exitPlayerModal(session) {
  return session.click(selectors.OVERLAY)
}

module.exports = {
  openWebsite, getListOfTeamFixtures, getListOfTeams, exitPlayerModal,
  getListOfUnavailablePlayers, getListOfPlayersByTeam, getPlayerStats,
}

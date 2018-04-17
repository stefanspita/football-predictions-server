/* global $ */
const selectors = require("./selectors")

function exitPlayerModal(session) {
  return session.click(selectors.OVERLAY)
}

function getListOfTeamFixtures(session) {
  return session
    .wait(selectors.PLAYER_FIXTURES_TAB)
    .click(selectors.PLAYER_FIXTURES_TAB)
    .evaluate((selectors) => {
      return $(selectors.TEAM_FIXTURES_ROWS)
        .filter(function() {
          const row = $(this)
          return row.find(selectors.TEAM_FIXTURE_DIFFICULTY).text().length !== 0
        })
        .map(function() {
          const row = $(this)
          return {
            round: parseInt(row.find(selectors.TEAM_FIXTURE_ROUND).text(), 10),
            difficulty: parseInt(row.find(selectors.TEAM_FIXTURE_DIFFICULTY).text(), 10),
          }
        })
        .get()
    }, selectors)
}

function getPlayerStats(session) {
  return session
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

module.exports = {exitPlayerModal, getPlayerStats, getListOfTeamFixtures}

/* global $ */
const selectors = require("./selectors")

function getListOfTeams(session) {
  return session
    .evaluate((teamsSelector) => {
      return $(teamsSelector)
        .map(function() {
          return {id: $(this).attr("value"), name: $(this).text()}
        })
        .get()
    }, selectors.TEAM_OPTIONS_IN_SELECTBOX)
}

function getListOfPlayersByTeam(session, teamId) {
  return session
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .evaluate((playerIdSelector) => {
      return $(playerIdSelector)
        .map(function() {
          return $(this).text()
        })
        .get()
    }, selectors.PLAYER_ID)
}

function getListOfUnavailablePlayers(session, teamId) {
  return session
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .evaluate((unavailablePlayersSelector, playerIdSelector) => {
      return $(unavailablePlayersSelector).parents("tr").find(playerIdSelector)
        .map(function() {
          return $(this).text()
        })
        .get()
    }, selectors.UNAVAILABLE_PLAYERS, selectors.PLAYER_ID)
}

function openPlayerDetailModal(session, teamId, playerIndex) {
  return session
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .click(`${selectors.PLAYER_ROW}:nth-child(${playerIndex + 1}) ${selectors.PLAYER_ID}`)
}

module.exports = {
  getListOfTeams, getListOfPlayersByTeam, getListOfUnavailablePlayers,
  openPlayerDetailModal,
}

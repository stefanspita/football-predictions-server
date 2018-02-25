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

module.exports = {getListOfTeams, getListOfPlayersByTeam}

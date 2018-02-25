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

module.exports = {getListOfTeams}

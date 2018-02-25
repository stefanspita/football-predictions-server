const Promise = require("bluebird")
const {statisticsPage} = require("../../services/website")

module.exports = function getUnavailablePlayersByTeam(session, teams) {
  return Promise.mapSeries(teams, (team) => {
    return statisticsPage.getListOfUnavailablePlayers(session, team.id)
      .then((unavailablePlayers) => ({
        teamId: team.id,
        teamName: team.name,
        unavailablePlayers,
      }))
      .tap(() => console.log(`Finished getting unavailable players for ${team.name}`))
  })
}

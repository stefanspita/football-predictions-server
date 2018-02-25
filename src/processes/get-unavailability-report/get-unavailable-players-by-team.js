const Promise = require("bluebird")
const {getListOfUnavailablePlayers, openWebsite} = require("../../services/website")

module.exports = function getUnavailablePlayersByTeam(teams) {
  const session = openWebsite()
  return Promise.mapSeries(teams, (team) => {
    return getListOfUnavailablePlayers(session, team.id)
      .then((unavailablePlayers) => ({
        teamId: team.id,
        teamName: team.name,
        unavailablePlayers,
      }))
      .tap(() => console.log(`Finished getting unavailable players for ${team.name}`))
  })
    .tap(() => session.end())
}

const {tap} = require("ramda")
const {getListOfUnavailablePlayers} = require("../../services/website/methods")

module.exports = function getUnavailablePlayersByTeam(team) {
  return getListOfUnavailablePlayers(team.id)
    .then(tap(() => console.log(`Finished getting unavailable players for ${team.name}`)))
    .then((unavailablePlayers) => ({
      teamId: team.id,
      teamName: team.name,
      unavailablePlayers,
    }))
}

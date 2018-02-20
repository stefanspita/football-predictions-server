const Promise = require("bluebird")
const {curry, merge} = require("ramda")
const {
  getListOfPlayersByTeam, getPlayerStats, openWebsite, exitPlayerModal,
} = require("../../services/website")

const aggregatePlayerInfo = curry((session, teamId, playerId, index) => {
  return getPlayerStats(session, teamId, index)
    .then(merge({id: playerId, teamId}))
    .tap(() => console.log(`Successfully fetched data for ${playerId}, playing for ${teamId}`))
    .tap(() => exitPlayerModal(session))
    .catch((err) => {
      console.log(`Error occurred getting data for ${playerId}, playing for ${teamId}`)
      throw err
    })
})

function getPlayerData(team) {
  const session = openWebsite()
  return getListOfPlayersByTeam(team.id)
    .then((playerIds) => Promise.mapSeries(
      playerIds,
      aggregatePlayerInfo(session, team.id)
    ))
    .tap(() => console.log(`Fetched player data for ${team.name}`))
    .tap(() => session.end())
}

module.exports = getPlayerData

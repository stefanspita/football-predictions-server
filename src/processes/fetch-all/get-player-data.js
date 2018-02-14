const Promise = require("bluebird")
const {curry, merge, tap} = require("ramda")
const {getListOfPlayersByTeam, getPlayerStats} = require("../../services/website")

const aggregatePlayerInfo = curry((teamId, playerId, index) => {
  return getPlayerStats(teamId, index)
    .then(merge({id: playerId, teamId}))
    .then((tap(() => console.log(`Successfully fetched data for ${playerId}, playing for ${teamId}`))))
    .catch((err) => {
      console.log(`Error occurred getting data for ${playerId}, playing for ${teamId}`)
      throw err
    })
})

function getPlayerData(team) {
  return getListOfPlayersByTeam(team.id)
    .then((playerIds) => Promise.mapSeries(playerIds, aggregatePlayerInfo(team.id)))
    .then(tap(() => console.log(`Fetched player data for ${team.name}`)))
}

module.exports = getPlayerData

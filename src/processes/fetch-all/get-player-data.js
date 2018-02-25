const Promise = require("bluebird")
const {curry, merge} = require("ramda")
const {
  statisticsPage, playerDetailsModal,
} = require("../../services/website")

const aggregatePlayerInfo = curry((session, teamId, playerId, index) => {
  return statisticsPage.openPlayerDetailModal(session, teamId, index)
    .then(() => playerDetailsModal.getPlayerStats(session))
    .then(merge({id: playerId, teamId}))
    .tap(() => console.log(`Successfully fetched data for ${playerId}, playing for ${teamId}`))
    .tap(() => playerDetailsModal.exitPlayerModal(session))
    .catch((err) => {
      console.log(`Error occurred getting data for ${playerId}, playing for ${teamId}`)
      throw err
    })
})

function getPlayerData(session, team) {
  return statisticsPage.getListOfPlayersByTeam(session, team.id)
    .then((playerIds) => Promise.mapSeries(
      playerIds,
      aggregatePlayerInfo(session, team.id)
    ))
    .tap(() => console.log(`Fetched player data for ${team.name}`))
}

module.exports = getPlayerData

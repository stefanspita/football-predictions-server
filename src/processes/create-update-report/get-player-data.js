const Promise = require("bluebird")
const {curry, tap} = require("ramda")
const {getListOfPlayersByTeam, getPlayerStats} = require("../../services/website")

const aggregatePlayerInfo = curry((teamId, playerId, index) => {
  return getPlayerStats(teamId, index + 1)
})

function getPlayerData(lastUpdatedGw, team) {
  return getListOfPlayersByTeam(team.id)
    .then((playerIds) => Promise.mapSeries([playerIds[0]], aggregatePlayerInfo(team.id)))
    .then(tap(() => console.log(`Fetched player data for ${team.name}`)))
}

module.exports = getPlayerData

const Promise = require("bluebird")
const {append, assoc, compose, contains, find, isNil, propEq, reject} = require("ramda")
const {getListOfPlayersByTeam, getPlayerStats, playerDetailsModal} = require("../../services/website")

function getRoundData(newData, gameweek, playerPossiblyUnavailable) {
  const newRoundData = find(propEq("round", gameweek), newData.currentSeason)
  if (isNil(newRoundData)) {
    throw new Error(`No new round data for ${newData.name}`)
  }
  if (playerPossiblyUnavailable && newRoundData.minutesPlayed === 0) {
    return assoc("unavailable", true, newRoundData)
  }
  return newRoundData
}

function getCurrentSeason(oldData, newData, newRoundData, gameweek) {
  if (!oldData) {
    return newData.currentSeason
  }
  return compose(
    append(newRoundData),
    reject(propEq("round", gameweek))
  )(oldData.currentSeason)
}

function mergePlayerData(oldData, newData, playerPossiblyUnavailable, gameweek) {
  const newRoundData = getRoundData(newData, gameweek, playerPossiblyUnavailable)
  const updatedCurrentSeason = getCurrentSeason(oldData, newData, newRoundData, gameweek)

  return compose(
    assoc("lastUpdatedGameweek", gameweek),
    assoc("currentSeason", updatedCurrentSeason)
  )(newData)
}

function getPlayerData(session, playersDb, unavailablePlayers, gameweek, team) {
  return getListOfPlayersByTeam(session, team.id)
    .then((playerIds) => Promise.mapSeries(
      playerIds,
      (playerId, index) => Promise.all([
        playersDb.findOne({id: playerId, teamId: team.id}),
        getPlayerStats(session, team.id, index),
        contains(playerId, unavailablePlayers),
      ])
        .spread((oldData, newData, playerPossiblyUnavailable) => {
          return mergePlayerData(oldData, newData, playerPossiblyUnavailable, gameweek)
        })
        .tap(() => console.log(`Successfully fetched data for ${playerId}, playing for ${team.id}`))
        .tap(() => playerDetailsModal.exitPlayerModal(session))
        .catch((err) => {
          console.log(`Error occurred getting data for ${playerId}, playing for ${team.id}`)
          throw err
        })
    ))
    .tap(() => console.log(`Fetched player data for ${team.name}`))
}

module.exports = getPlayerData

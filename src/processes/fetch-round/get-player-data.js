const Promise = require("bluebird")
const {append, assoc, compose, contains, find, isNil, path, propEq, reject} = require("ramda")
const {statisticsPage, playerDetailsModal} = require("../../services/website")

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

function mergePlayerData({oldData, newData, playerPossiblyUnavailable, gameweek, playerId, teamId}) {
  const newRoundData = getRoundData(newData, gameweek, playerPossiblyUnavailable)
  const updatedCurrentSeason = getCurrentSeason(oldData, newData, newRoundData, gameweek)

  return compose(
    assoc("owned", path(["owned"], oldData)),
    assoc("id", playerId),
    assoc("teamId", teamId),
    assoc("lastUpdatedGameweek", gameweek),
    assoc("currentSeason", updatedCurrentSeason)
  )(newData)
}

function getNewPlayerStats(session, teamId, playerIndex) {
  return statisticsPage.openPlayerDetailModal(session, teamId, playerIndex)
    .then(() => playerDetailsModal.getPlayerStats(session))
}

function getPlayerData(session, playersDb, unavailablePlayers, gameweek, team) {
  const teamId = team.id
  return statisticsPage.getListOfPlayersByTeam(session, teamId)
    .then((playerIds) => Promise.mapSeries(
      playerIds,
      (playerId, index) => Promise.all([
        playersDb.findOne({id: playerId, teamId}),
        getNewPlayerStats(session, teamId, index),
        contains(playerId, unavailablePlayers),
      ])
        .spread((oldData, newData, playerPossiblyUnavailable) => {
          return mergePlayerData({oldData, newData, playerPossiblyUnavailable, gameweek, playerId, teamId})
        })
        .tap(() => console.log(`Successfully fetched data for ${playerId}, playing for ${teamId}`))
        .tap(() => playerDetailsModal.exitPlayerModal(session))
        .catch((err) => {
          console.log(`Error occurred getting data for ${playerId}, playing for ${teamId}`)
          throw err
        })
    ))
    .tap(() => console.log(`Fetched player data for ${team.name}`))
}

module.exports = getPlayerData

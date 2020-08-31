const Promise = require("bluebird")
const {__, assoc, compose, concat, contains, filter, map, path, prop, propEq} = require("ramda")
const {statisticsPage, playerDetailsModal} = require("../../services/website")

const getCurrentSeasonRounds = prop("currentSeason")

function setUnavailabilityFlagForRound(playerPossiblyUnavailable, round) {
  if (playerPossiblyUnavailable && round.minutesPlayed === 0) {
    return assoc("unavailable", true, round)
  }
  return round
}

function getRoundData(newData, gameweek, playerPossiblyUnavailable) {
  const getCurrentRounds = filter(propEq("round", gameweek))
  const checkIfPlayerCurrentlyUnavailable = map((round) => setUnavailabilityFlagForRound(playerPossiblyUnavailable, round))

  return compose(
    checkIfPlayerCurrentlyUnavailable,
    getCurrentRounds,
    getCurrentSeasonRounds,
  )(newData)
}

function getCurrentSeason(oldData, newData, newRounds) {
  if (!oldData) {
    return newData.currentSeason
  }

  return compose(
    concat(__, newRounds),
    getCurrentSeasonRounds,
  )(oldData)
}

function mergePlayerData({oldData, newData, playerPossiblyUnavailable, gameweek, playerId, teamId}) {
  const newRoundsData = getRoundData(newData, gameweek, playerPossiblyUnavailable)
  const updatedCurrentSeason = getCurrentSeason(oldData, newData, newRoundsData)
  const playerOwned = path(["owned"], oldData)

  return compose(
    assoc("owned", playerOwned),
    assoc("id", playerId),
    assoc("teamId", teamId),
    assoc("lastUpdatedGameweek", gameweek),
    assoc("currentSeason", updatedCurrentSeason),
  )(newData)
}

function getUpdatedPlayerStats(session, teamId, playerIndex) {
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
        getUpdatedPlayerStats(session, teamId, index),
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
        }),
    ))
    .tap(() => console.log(`Fetched player data for ${team.name}`))
}

module.exports = getPlayerData

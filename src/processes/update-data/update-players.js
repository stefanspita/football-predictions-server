/* eslint-disable complexity */
const Promise = require("bluebird")
const {map, pick} = require("ramda")

function validatePlayer(player) {
  if (player.lastUpdatedGw !== player.gwToUpdate - 1)
    throw new Error(`Error found in player update statement for ${player.name}. gwToUpdate is invalid`)
  if (player.priceChange < -0.2 || player.priceChange > 0.2)
    throw new Error(`Error found in player update statement for ${player.name}. price is invalid`)
  if (player.minutesPlayed < 0 || player.minutesPlayed > 90)
    throw new Error(`Error found in player update statement for ${player.name}. minutesPlayed are invalid`)
  if (player.points < -5 || player.points > 25)
    throw new Error(`Error found in player update statement for ${player.name}. points are invalid`)
  if (player.bps < -20 || player.bps > 100)
    throw new Error(`Error found in player update statement for ${player.name}. bps is invalid`)
}

function updatePlayerData(playersCollection, player) {
  return playersCollection.updateOne({id: player.id}, {
    $set: {
      lastUpdatedGw: player.gwToUpdate,
    },
    $inc: {
      price: player.priceChange,
      "thisSeason.minutesPlayed": player.minutesPlayed,
      "thisSeason.points": player.points,
      "thisSeason.bps": player.bps,
    },
    $pop: {"thisSeason.last6Games": -1},
  }).then(() => {
    const lastGame = pick(["minutesPlayed", "points", "priceChange"], player)
    return playersCollection.updateOne({id: player.id}, {
      $push: {"thisSeason.last6Games": lastGame},
    })
  })
}

module.exports = function updatePlayers(db, playersUpdate) {
  const playersCollection = db.collection("players")

  return Promise.all(
    map((player) => {
      return Promise.resolve()
        .then(() => validatePlayer(player))
        .then(() => updatePlayerData(playersCollection, player))
        .then(() => console.log(`Successfully updated ${player.name}`))
        .catch((err) => console.error(err.message))
    }, playersUpdate)
  )
}

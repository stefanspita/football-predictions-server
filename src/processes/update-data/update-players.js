/* eslint-disable complexity */
const Promise = require("bluebird")
const {map} = require("ramda")

function validatePlayer(player) {
  if (player.lastUpdatedGw !== player.gwToUpdate - 1)
    throw new Error(`Error found in player update statement for ${player.name}. gwToUpdate is invalid`)
  if (player.price < 3.8 || player.price > 14)
    throw new Error(`Error found in player update statement for ${player.name}. price is invalid`)
  if (player.minutes < 0 || player.minutes > 90)
    throw new Error(`Error found in player update statement for ${player.name}. minutes are invalid`)
  if (player.points < 0 || player.points > 25)
    throw new Error(`Error found in player update statement for ${player.name}. points are invalid`)
  if (player.bps < 0 || player.bps > 100)
    throw new Error(`Error found in player update statement for ${player.name}. bps is invalid`)
}

function updatePlayerData(playersCollection, player) {
  return playersCollection.updateOne({id: player.id}, {
    $set: {
      lastUpdatedGw: player.gwToUpdate,
      price: player.price,
    },
    $inc: {
      "thisSeason.minutes": player.minutes,
      "thisSeason.points": player.points,
      "thisSeason.bps": player.bps,
    },
    $pop: {"thisSeason.last6GamesMinutes": -1},
  }).then(() => {
    return playersCollection.updateOne({id: player.id}, {
      $push: {"thisSeason.last6GamesMinutes": player.minutes},
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

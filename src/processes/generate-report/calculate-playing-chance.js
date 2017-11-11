const {__, compose, divide, multiply, objOf, path, sum} = require("ramda")

module.exports = function calculatePlayingChance(player) {
  return compose(
    objOf("playingChance"),
    multiply(100),
    divide(__, 90 * 6),
    sum,
    path(["thisSeason", "last6GamesMinutes"])
  )(player)
}

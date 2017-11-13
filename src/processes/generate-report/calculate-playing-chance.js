const {__, compose, divide, multiply, objOf, path, pluck, sum} = require("ramda")

module.exports = function calculatePlayingChance(player) {
  return compose(
    objOf("playingChance"),
    multiply(100),
    divide(__, 90 * 6),
    sum,
    pluck("minutesPlayed"),
    path(["thisSeason", "last6Games"])
  )(player)
}

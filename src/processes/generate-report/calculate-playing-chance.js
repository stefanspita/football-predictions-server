const {__, compose, divide, multiply, path, sum} = require("ramda")
const {PLAYING_CHANCE_GROUPS} = require("./rules")
const {findGradeDescending} = require("./utils")

module.exports = function calculatePlayingChance(player) {
  const playingChance = compose(
    multiply(100),
    divide(__, 90 * 6),
    sum,
    path(["thisSeason", "last6GamesMinutes"])
  )(player)
  const playingChance_grade = findGradeDescending(playingChance, PLAYING_CHANCE_GROUPS)

  return {playingChance, playingChance_grade}
}

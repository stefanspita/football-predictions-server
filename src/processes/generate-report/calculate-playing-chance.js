const {__, compose, divide, filter, multiply, not, pluck, propEq, sum, takeLast} = require("ramda")
const {PLAYING_CHANCE_GROUPS} = require("./rules")
const {findGradeDescending} = require("./utils")

const roundsFilter = compose(not, propEq("unavailable", true))

module.exports = function calculatePlayingChance({currentSeason}) {
  const playingChance = compose(
    multiply(100),
    divide(__, 90 * 6),
    sum,
    pluck("minutesPlayed"),
    takeLast(6),
    filter(roundsFilter)
  )(currentSeason)

  const playingChance_grade = findGradeDescending(playingChance, PLAYING_CHANCE_GROUPS)

  return {playingChance, playingChance_grade}
}

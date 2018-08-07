const {
  __, compose, divide, filter, find, length, max, min, multiply, not,
  pluck, propOr, propEq, sum, takeLast,
} = require("ramda")
const {PLAYING_CHANCE_GROUPS, LAST_SEASON} = require("./rules")
const {findGradeDescending} = require("./utils")

const NUMBER_OF_MINUTES_IN_A_SEASON = 3420
const NUMBER_OF_PREVIOUS_GAMES = 6
const roundsFilter = compose(not, propEq("unavailable", true))

function getWeights(previousSeasonMinutes, currentSeason) {
  let currentSeasonWeight
  if (!previousSeasonMinutes) {
    currentSeasonWeight = 1
  } else {
    currentSeasonWeight = compose(
      divide(__, NUMBER_OF_PREVIOUS_GAMES),
      min(NUMBER_OF_PREVIOUS_GAMES),
      length,
      filter(roundsFilter)
    )(currentSeason)
  }

  const previousSeasonWeight = 1 - currentSeasonWeight
  return {currentSeasonWeight, previousSeasonWeight}
}

function getPlayingChances(previousSeasonMinutes, currentSeason) {
  const previousSeasonPlayingChance = compose(
    multiply(100),
    divide(__, NUMBER_OF_MINUTES_IN_A_SEASON)
  )(previousSeasonMinutes)

  const currentSeasonPlayingChance = compose(
    multiply(100),
    divide(__, 90 * min(NUMBER_OF_PREVIOUS_GAMES, max(currentSeason.length, 1))),
    sum,
    pluck("minutesPlayed"),
    takeLast(NUMBER_OF_PREVIOUS_GAMES),
    filter(roundsFilter)
  )(currentSeason)

  return {previousSeasonPlayingChance, currentSeasonPlayingChance}
}

const getPreviousSeasonMinutes = compose(
  propOr(0, "minutesPlayed"),
  find(propEq("season", LAST_SEASON))
)

module.exports = function calculatePlayingChance({currentSeason, previousSeasons}) {
  const previousSeasonMinutes = getPreviousSeasonMinutes(previousSeasons)
  const {previousSeasonPlayingChance, currentSeasonPlayingChance} = getPlayingChances(previousSeasonMinutes, currentSeason)
  const {previousSeasonWeight, currentSeasonWeight} = getWeights(previousSeasonMinutes, currentSeason)
  const playingChance = previousSeasonPlayingChance * previousSeasonWeight +
    currentSeasonPlayingChance * currentSeasonWeight
  const playingChance_grade = findGradeDescending(playingChance, PLAYING_CHANCE_GROUPS)

  return {playingChance, playingChance_grade}
}

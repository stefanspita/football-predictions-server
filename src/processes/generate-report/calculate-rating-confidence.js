const {__, compose, divide, find, min, multiply, pluck, propEq, propOr, sum} = require("ramda")
const {
  MINUTES_CONFIDENCE_THRESHOLD, WEIGHT_CONFIDENCE_CURRENT_SEASON, WEIGHT_CONFIDENCE_LAST_SEASON,
  WEIGHT_CONFIDENCE_2_SEASONS_AGO, CONFIDENCE_GROUPS, LAST_SEASON, TWO_SEASONS_AGO,
} = require("./rules")
const {findGradeDescending} = require("./utils")

function calculateSeasonConfidence(minutesPlayed, weight) {
  return compose(
    multiply(weight),
    divide(__, MINUTES_CONFIDENCE_THRESHOLD),
    min(MINUTES_CONFIDENCE_THRESHOLD),
  )(minutesPlayed)
}

function getPastSeasonsMinutes(season, previousSeasons) {
  return compose(
    propOr(0, "minutesPlayed"),
    find(propEq("season", season)),
  )(previousSeasons)
}

const getCurrentSeasonMinutes = compose(sum, pluck("minutesPlayed"))

module.exports = function calculateRatingConfidence({previousSeasons, currentSeason}) {
  const minutes_2_seasons_ago = getPastSeasonsMinutes(TWO_SEASONS_AGO, previousSeasons)
  const minutes_last_season = getPastSeasonsMinutes(LAST_SEASON, previousSeasons)
  const minutes_current_season = getCurrentSeasonMinutes(currentSeason)

  const confidence_2_seasons_ago = calculateSeasonConfidence(minutes_2_seasons_ago, WEIGHT_CONFIDENCE_2_SEASONS_AGO)
  const confidence_last_season = calculateSeasonConfidence(minutes_last_season, WEIGHT_CONFIDENCE_LAST_SEASON)
  const confidenceThisSeason = calculateSeasonConfidence(minutes_current_season, WEIGHT_CONFIDENCE_CURRENT_SEASON)

  const confidence = (confidence_2_seasons_ago + confidence_last_season + confidenceThisSeason) * 100
  const confidence_grade = findGradeDescending(confidence, CONFIDENCE_GROUPS)
  return {confidence, confidence_grade}
}

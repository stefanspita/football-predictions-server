const {
  MINUTES_CONFIDENCE_THRESHOLD, WEIGHT_CONFIDENCE_CURRENT_SEASON, WEIGHT_CONFIDENCE_A_SEASON_AGO,
  WEIGHT_CONFIDENCE_2_SEASONS_AGO, CONFIDENCE_GROUPS,
} = require("./rules")
const {findGradeDescending} = require("./utils")
const {__, compose, divide, min, multiply} = require("ramda")

function calculateSeasonConfidence(season, weight) {
  if (season) {
    return compose(
      multiply(weight),
      divide(__, MINUTES_CONFIDENCE_THRESHOLD),
      min(MINUTES_CONFIDENCE_THRESHOLD)
    )(season.minutesPlayed)
  }

  return 0
}

module.exports = function calculateRatingConfidence(player) {
  const confidence_2015 = calculateSeasonConfidence(player["2015"], WEIGHT_CONFIDENCE_2_SEASONS_AGO)
  const confidence_2016 = calculateSeasonConfidence(player["2016"], WEIGHT_CONFIDENCE_A_SEASON_AGO)
  const confidenceThisSeason = calculateSeasonConfidence(player.thisSeason, WEIGHT_CONFIDENCE_CURRENT_SEASON)

  const confidence = (confidence_2015 + confidence_2016 + confidenceThisSeason) * 100
  const confidence_grade = findGradeDescending(confidence, CONFIDENCE_GROUPS)
  return {confidence, confidence_grade}
}

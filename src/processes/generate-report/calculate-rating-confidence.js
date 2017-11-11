const {
  MINUTES_CONFIDENCE_THRESHOLD, WEIGHT_CONFIDENCE_CURRENT_SEASON, WEIGHT_CONFIDENCE_2016,
  WEIGHT_CONFIDENCE_2015,
} = require("./rules")
const {__, compose, divide, min, multiply} = require("ramda")

function calculateSeasonConfidence(season, weight) {
  if (season) {
    console.log(season, weight)
    return compose(
      multiply(weight),
      divide(__, MINUTES_CONFIDENCE_THRESHOLD),
      min(MINUTES_CONFIDENCE_THRESHOLD)
    )(season.minutesPlayed)
  }

  return 0
}

module.exports = function calculateRatingConfidence(player) {
  const confidence_2015 = calculateSeasonConfidence(player["2015"], WEIGHT_CONFIDENCE_2015)
  const confidence_2016 = calculateSeasonConfidence(player["2016"], WEIGHT_CONFIDENCE_2016)
  const confidenceThisSeason = calculateSeasonConfidence(player.thisSeason, WEIGHT_CONFIDENCE_CURRENT_SEASON)

  const confidence = (confidence_2015 + confidence_2016 + confidenceThisSeason) * 100
  return {confidence}
}

const {__, compose, divide, isNil, max, min, subtract} = require("ramda")
const {
  MAX_MINUTE_PER_BPS, MIN_MINUTE_PER_BPS, MAX_MINUTE_PER_POINT, MIN_MINUTE_PER_POINT,
  BPS_WEIGHT, POINTS_WEIGHT, WEIGHT_MULTIPLIER_CURRENT_SEASON, WEIGHT_MULTIPLIER_2015,
  WEIGHT_MULTIPLIER_2016, RATING_GROUPS,
} = require("./rules")
const {findGradeDescending} = require("./utils")


function calculateRating(stats, weight) {
  if (isNil(stats)) return 0

  const {minutesPlayed, points, bps} = stats
  const minutesPerBps = compose(
    divide(__, MAX_MINUTE_PER_BPS - MIN_MINUTE_PER_BPS),
    subtract(MAX_MINUTE_PER_BPS),
    max(MIN_MINUTE_PER_BPS),
    min(MAX_MINUTE_PER_BPS)
  )(minutesPlayed / bps)

  const minutesPerPoint = compose(
    divide(__, MAX_MINUTE_PER_POINT - MIN_MINUTE_PER_POINT),
    subtract(MAX_MINUTE_PER_POINT),
    max(MIN_MINUTE_PER_POINT),
    min(MAX_MINUTE_PER_POINT)
  )(minutesPlayed / points)

  const rating = minutesPerBps * BPS_WEIGHT + minutesPerPoint * POINTS_WEIGHT
  return rating * weight
}

function getRatings(stats_2015, stats_2016, stats_2017) {
  const minutes_2015 = stats_2015 ?
    stats_2015.minutesPlayed * WEIGHT_MULTIPLIER_2015 : 0
  const minutes_2016 = stats_2016 ?
    stats_2016.minutesPlayed * WEIGHT_MULTIPLIER_2016 : 0
  const minutes_2017 = stats_2017 ?
    stats_2017.minutesPlayed * WEIGHT_MULTIPLIER_CURRENT_SEASON : 0
  const totalMinutes = minutes_2015 + minutes_2016 + minutes_2017

  const weight_2015 = minutes_2015 / totalMinutes
  const weight_2016 = minutes_2016 / totalMinutes
  const weight_2017 = minutes_2017 / totalMinutes

  return {weight_2015, weight_2016, weight_2017}
}


module.exports = function calculatePlayerRating(player) {
  const {
    weight_2015, weight_2016, weight_2017,
  } = getRatings(player["2015"], player["2016"], player.thisSeason)

  const rating_2015 = calculateRating(player["2015"], weight_2015)
  const rating_2016 = calculateRating(player["2016"], weight_2016)
  const rating_2017 = calculateRating(player.thisSeason, weight_2017)
  const rating = (rating_2015 + rating_2016 + rating_2017) * 100
  const rating_grade = findGradeDescending(rating, RATING_GROUPS)
  return {rating, rating_grade}
}

const {__, compose, defaultTo, divide, find, max, min, propEq, reduce, subtract} = require("ramda")
const {
  MAX_MINUTE_PER_BPS, MIN_MINUTE_PER_BPS, MAX_MINUTE_PER_POINT, MIN_MINUTE_PER_POINT,
  BPS_WEIGHT, POINTS_WEIGHT, WEIGHT_MULTIPLIER_CURRENT_SEASON, WEIGHT_MULTIPLIER_2_SEASONS_AGO,
  WEIGHT_MULTIPLIER_LAST_SEASON, RATING_GROUPS, LAST_SEASON, TWO_SEASONS_AGO,
} = require("./rules")
const {findGradeDescending} = require("./utils")


function calculateRating(stats, weight) {
  const {minutesPlayed, points, bps} = stats

  if (minutesPlayed === 0) return 0

  const minutesPerBps = compose(
    divide(__, MAX_MINUTE_PER_BPS - MIN_MINUTE_PER_BPS),
    subtract(MAX_MINUTE_PER_BPS),
    max(MIN_MINUTE_PER_BPS),
    min(MAX_MINUTE_PER_BPS),
  )(minutesPlayed / bps)

  const minutesPerPoint = compose(
    divide(__, MAX_MINUTE_PER_POINT - MIN_MINUTE_PER_POINT),
    subtract(MAX_MINUTE_PER_POINT),
    max(MIN_MINUTE_PER_POINT),
    min(MAX_MINUTE_PER_POINT),
  )(minutesPlayed / points)

  const rating = minutesPerBps * BPS_WEIGHT + minutesPerPoint * POINTS_WEIGHT
  return rating * weight
}

function getWeights(minutes_2_seasons_ago, minutes_last_season, minutes_current_season) {
  const two_seasons_ago = minutes_2_seasons_ago * WEIGHT_MULTIPLIER_2_SEASONS_AGO
  const last_season = minutes_last_season * WEIGHT_MULTIPLIER_LAST_SEASON
  const current_season = minutes_current_season * WEIGHT_MULTIPLIER_CURRENT_SEASON
  const totalMinutes = two_seasons_ago + last_season + current_season

  const weight_2_seasons_ago = totalMinutes ? two_seasons_ago / totalMinutes : 0
  const weight_last_season = totalMinutes ? last_season / totalMinutes : 0
  const weight_current_season = totalMinutes ? current_season / totalMinutes : 0

  return {weight_2_seasons_ago, weight_last_season, weight_current_season}
}

function getPreviousSeasonsStats(defaultStats, season, previousSeasons) {
  return compose(
    defaultTo(defaultStats),
    find(propEq("season", season)),
  )(previousSeasons)
}

function getCurrentSeasonTotals(acc, roundStats) {
  return {
    minutesPlayed: acc.minutesPlayed + roundStats.minutesPlayed,
    points: acc.points + roundStats.points,
    bps: acc.bps + roundStats.bps,
  }
}

module.exports = function calculatePlayerRating({previousSeasons, currentSeason}) {
  const initialTotals = {minutesPlayed: 0, points: 0, bps: 0}
  const two_seasons_ago_stats = getPreviousSeasonsStats(initialTotals, TWO_SEASONS_AGO, previousSeasons)
  const last_season_stats = getPreviousSeasonsStats(initialTotals, LAST_SEASON, previousSeasons)
  const current_season_stats = reduce(getCurrentSeasonTotals, initialTotals, currentSeason)

  const {
    weight_2_seasons_ago, weight_last_season, weight_current_season,
  } = getWeights(two_seasons_ago_stats.minutesPlayed, last_season_stats.minutesPlayed, current_season_stats.minutesPlayed)

  const rating_2_seasons_ago = calculateRating(two_seasons_ago_stats, weight_2_seasons_ago)
  const rating_last_season = calculateRating(last_season_stats, weight_last_season)
  const rating_current_season = calculateRating(current_season_stats, weight_current_season)
  const rating = (rating_2_seasons_ago + rating_last_season + rating_current_season) * 100
  const rating_grade = findGradeDescending(rating, RATING_GROUPS)
  return {rating, rating_grade}
}

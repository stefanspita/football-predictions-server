module.exports = {
  // mix/max thresholds for the metrics to calculate ratings
  MIN_MINUTE_PER_BPS: 3,
  MAX_MINUTE_PER_BPS: 10,
  MIN_MINUTE_PER_POINT: 10,
  MAX_MINUTE_PER_POINT: 50,

  // metric weights
  BPS_WEIGHT: 0.4,
  POINTS_WEIGHT: 0.6,

  // rating weights per season
  WEIGHT_MULTIPLIER_CURRENT_SEASON: 2,
  WEIGHT_MULTIPLIER_2016: 1,
  WEIGHT_MULTIPLIER_2015: 0.5,

  // confidence
  MINUTES_CONFIDENCE_THRESHOLD: 1500,
  WEIGHT_CONFIDENCE_CURRENT_SEASON: 0.7,
  WEIGHT_CONFIDENCE_2016: 0.2,
  WEIGHT_CONFIDENCE_2015: 0.1,

  FIXTURE_DIFFICULTY_GROUPS: [{value: 1, points: 5}, {value: 2, points: 4}, {value: 3, points: 3}, {value: 4, points: 2}, {value: 5, points: 1}],
}

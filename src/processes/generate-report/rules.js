module.exports = {
  LAST_SEASON: "2016/17",
  TWO_SEASONS_AGO: "2017/18",
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
  WEIGHT_MULTIPLIER_LAST_SEASON: 1,
  WEIGHT_MULTIPLIER_2_SEASONS_AGO: 0.5,

  // confidence
  MINUTES_CONFIDENCE_THRESHOLD: 1500,
  WEIGHT_CONFIDENCE_CURRENT_SEASON: 0.7,
  WEIGHT_CONFIDENCE_LAST_SEASON: 0.2,
  WEIGHT_CONFIDENCE_2_SEASONS_AGO: 0.1,

  FIXTURE_DIFFICULTY_GROUPS: [{value: 1.5, points: 3}, {value: 3, points: 2}, {value: 4, points: 1}, {value: 5, points: 0}],
  PRICE_GROUPS: [{value: 6, points: 3}, {value: 8, points: 2}, {value: 10, points: 1}, {value: 15, points: 0}],
  RATING_GROUPS: [{value: 85, points: 7}, {value: 80, points: 6}, {value: 75, points: 5}, {value: 70, points: 4}, {value: 65, points: 3}, {value: 60, points: 2}, {value: 50, points: 1}, {value: 0, points: 0}],
  PLAYING_CHANCE_GROUPS: [{value: 90, points: 6}, {value: 80, points: 5}, {value: 70, points: 4}, {value: 60, points: 3}, {value: 50, points: 2}, {value: 40, points: 1}, {value: 0, points: 0}],
  CONFIDENCE_GROUPS: [{value: 80, points: 5}, {value: 70, points: 4}, {value: 60, points: 3}, {value: 50, points: 2}, {value: 30, points: 1}, {value: 0, points: 0}],
  SELECTION_PERCENTAGE_GROUPS: [{value: 15, points: 2}, {value: 30, points: 1}, {value: 100, points: 0}],
}

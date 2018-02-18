const {assoc, compose, pick, sum, values} = require("ramda")

function round(value) {
  return Number(Math.round(value + "e" + 2) + "e-" + 2)
}

function calculateOverallGrade(playerReport) {
  return compose(
    sum,
    values,
    pick(["fixtureDifficulty_3_grade", "rating_grade", "playingChance_grade", "confidence_grade", "price_grade", "selection_percent_grade"])
  )(playerReport)
}

function calculateNextGameGrade(playerReport) {
  return compose(
    sum,
    values,
    pick(["fixtureDifficulty_1_grade", "rating_grade", "playingChance_grade", "confidence_grade", "price_grade"])
  )(playerReport)
}

function calculateOverallRating(playerReport) {
  return round(playerReport.rating * playerReport.playingChance / 100)
}

function calculateDerivedData(playerReport) {
  return compose(
    assoc("nextGameGrade", calculateNextGameGrade(playerReport)),
    assoc("grade", calculateOverallGrade(playerReport)),
    assoc("rating", round(playerReport.rating)),
    assoc("overallRating", calculateOverallRating(playerReport)),
    assoc("owned", playerReport.owned ? "owned" : "")
  )(playerReport)
}

module.exports = calculateDerivedData

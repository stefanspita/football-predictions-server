const {SELECTION_PERCENTAGE_GROUPS} = require("./rules")
const {findGradeDescending} = require("./utils")

module.exports = function calculateFixturesDifficulty({selectionPercent}) {
  const selection_percent_grade = findGradeDescending(selectionPercent, SELECTION_PERCENTAGE_GROUPS)

  return {selection_percent_grade}
}

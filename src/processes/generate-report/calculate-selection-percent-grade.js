const {SELECTION_PERCENTAGE_GROUPS} = require("./rules")
const {findGradeAscending} = require("./utils")

module.exports = function calculateFixturesDifficulty({selectionPercent}) {
  const selection_percent_grade = findGradeAscending(selectionPercent, SELECTION_PERCENTAGE_GROUPS)

  return {selection_percent_grade}
}

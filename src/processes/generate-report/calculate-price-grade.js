const {PRICE_GROUPS} = require("./rules")
const {findGradeAscending} = require("./utils")

module.exports = function calculateFixturesDifficulty({price}) {
  const price_grade = findGradeAscending(price, PRICE_GROUPS)

  return {price_grade}
}

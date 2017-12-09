const {PRICE_GROUPS} = require("./rules")
const {findGradeAscending} = require("./utils")

module.exports = function calculateFixturesDifficulty(player) {
  const price_grade = findGradeAscending(player.price, PRICE_GROUPS)

  return {price_grade}
}

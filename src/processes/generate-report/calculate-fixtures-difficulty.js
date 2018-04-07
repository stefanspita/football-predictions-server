const {compose, head, min, sum, take} = require("ramda")
const {FIXTURE_DIFFICULTY_GROUPS} = require("./rules")
const {findGradeAscending} = require("./utils")

module.exports = function calculateFixturesDifficulty(player, {fixtures}) {
  const fixturesDifficulty_1 = head(fixtures)

  const numberOfFixtures = min(3, fixtures.length)
  const fixturesDifficulty_3_average = compose(sum, take(3))(fixtures) / numberOfFixtures

  const fixtureDifficulty_1_grade = findGradeAscending(fixturesDifficulty_1, FIXTURE_DIFFICULTY_GROUPS)
  const fixtureDifficulty_3_grade = findGradeAscending(fixturesDifficulty_3_average, FIXTURE_DIFFICULTY_GROUPS)

  return {
    fixtureDifficulty_1_grade,
    fixtureDifficulty_3_grade,
  }
}

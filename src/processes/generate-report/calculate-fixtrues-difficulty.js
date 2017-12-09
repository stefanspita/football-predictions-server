const {compose, sum, take} = require("ramda")
const {FIXTURE_DIFFICULTY_GROUPS} = require("./rules")
const {findGradeAscending} = require("./utils")

module.exports = function calculateFixturesDifficulty(player, team) {
  const fixturesDifficulty_3 = compose(sum, take(3))(team.fixtures)
  const fixturesDifficulty_5 = sum(team.fixtures)

  const fixtureDifficulty_3_grade = findGradeAscending(fixturesDifficulty_3 / 3, FIXTURE_DIFFICULTY_GROUPS)
  const fixtureDifficulty_5_grade = findGradeAscending(fixturesDifficulty_5 / 5, FIXTURE_DIFFICULTY_GROUPS)

  return {
    fixtureDifficulty_3_grade,
    fixtureDifficulty_5_grade,
  }
}

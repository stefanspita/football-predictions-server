const {compose, curry, find, prop, sum, take} = require("ramda")
const {FIXTURE_DIFFICULTY_GROUPS} = require("./rules")

const findGrade = curry((difficulty, groups) => {
  return compose(
    prop("points"),
    find((group) => {
      if (difficulty <= group.value) return true
      return false
    })
  )(groups)
})

module.exports = function calculateFixturesDifficulty(player, team) {
  const fixturesDifficulty_3 = compose(sum, take(3))(team.fixtures)
  const fixturesDifficulty_5 = sum(team.fixtures)

  const fixtureDifficulty_3_grade = findGrade(fixturesDifficulty_3 / 3, FIXTURE_DIFFICULTY_GROUPS)
  const fixtureDifficulty_5_grade = findGrade(fixturesDifficulty_5 / 5, FIXTURE_DIFFICULTY_GROUPS)

  return {
    fixtureDifficulty_3_grade,
    fixtureDifficulty_5_grade,
  }
}

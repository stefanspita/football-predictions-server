const {__, compose, contains, defaultTo, divide, filter, multiply, pluck, sum} = require("ramda")
const {FIXTURE_DIFFICULTY_GROUPS} = require("./rules")
const {findGradeAscending} = require("./utils")

function getFixturesGrade(fixtures, roundNumbers) {
  const numberOfRounds = roundNumbers.length
  const relevantFixtures = filter(({round}) => contains(round, roundNumbers), fixtures)

  return compose(
    defaultTo(0),
    multiply(relevantFixtures.length / numberOfRounds),
    (averageDifficulty) => findGradeAscending(averageDifficulty, FIXTURE_DIFFICULTY_GROUPS),
    divide(__, relevantFixtures.length),
    sum,
    pluck("difficulty"),
  )(relevantFixtures)
}


module.exports = function calculateFixturesDifficulty(player, {fixtures, lastUpdatedGameweek = 0}) {
  const nextRound = lastUpdatedGameweek + 1
  const next3Rounds = [lastUpdatedGameweek + 1, lastUpdatedGameweek + 2, lastUpdatedGameweek + 3]

  return {
    fixtureDifficulty_1_grade: getFixturesGrade(fixtures, [nextRound]),
    fixtureDifficulty_3_grade: getFixturesGrade(fixtures, next3Rounds),
  }
}

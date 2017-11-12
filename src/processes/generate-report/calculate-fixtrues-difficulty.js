const {sum} = require("ramda")

module.exports = function calculateFixturesDifficulty(player, team) {
  return {fixturesDifficulty: sum(team.fixtures)}
}

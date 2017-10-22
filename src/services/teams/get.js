const {find, propEq, isNil, slice, sum, compose, curry} = require("ramda")

const getTeamDetails = curry((teams, id) => {
  const team = find(propEq("id", id), teams)
  if (isNil(team)) throw new Error(`Team id ${id} not found`)
  return team
})

const getTeamNextFixtures = curry((teams, id, noOfFixtures) => {
  if (noOfFixtures < 1 || noOfFixtures > 5)
    throw new Error(`Number of fixtures has to be a number between 1 and 5. Currently it's ${noOfFixtures}`)
  const team = getTeamDetails(teams, id)
  return compose(sum, slice(0, noOfFixtures))(team.fixtures)
})

module.exports = function(teams) {
  return {
    getTeamDetails: getTeamDetails(teams),
    getTeamNextFixtures: getTeamNextFixtures(teams),
  }
}

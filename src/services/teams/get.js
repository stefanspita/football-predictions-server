const {find, propEq, isNil} = require("ramda")
const teams = require("./teams")

function getTeamDetails(id) {
  const team = find(propEq("id", id), teams)
  if (isNil(team)) throw new Error(`Team id ${id} not found`)
  return team
}

module.exports = {
  getTeamDetails,
}

const {forEach, map} = require("ramda")

function validateTeam(team) {
  if (team.lastUpdatedGw !== team.gwToUpdate - 1)
    throw new Error(`Error found in update statement for ${team.name}. gwToUpdate is invalid`)
  if (team.fixtures.length !== 5)
    throw new Error(`Error found in update statement for ${team.name}. The number of fixtures is not 5`)
}

function validateTeamsUpdate(teamsUpdate) {
  forEach(validateTeam, teamsUpdate)
}

function updateTeamData(db, teamsUpdate) {
  const teamsCollection = db.collection("teams")
  return Promise.all(map((team) => {
    return teamsCollection.updateOne({id: team.id}, {
      $set: {lastUpdatedGw: team.gwToUpdate, fixtures: team.fixtures},
    })
  }, teamsUpdate))
}

module.exports = function updateTeams(db, teamsUpdate) {
  return Promise.resolve()
    .then(() => validateTeamsUpdate(teamsUpdate))
    .then(() => updateTeamData(db, teamsUpdate))
}

const {getListOfTeamFixtures} = require("../../services/website")

function getTeamData(team) {
  return getListOfTeamFixtures(team.id)
    .tap(() => console.log(`Fetched team update for ${team.name}`))
    .then((fixtures) => ({
      id: team.id,
      name: team.name,
      fixtures,
    }))
}

module.exports = getTeamData

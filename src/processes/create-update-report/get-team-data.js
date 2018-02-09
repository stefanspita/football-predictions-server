const {getListOfTeamFixtures} = require("./website/methods")

function getTeamData(lastUpdatedGw, team) {
  return getListOfTeamFixtures(team.id)
    .then((console.log(`Fetched team update for ${team.name}`)))
    .then((fixtures) => ({
      id: team.id,
      name: team.name,
      fixtures,
      lastUpdatedGw,
    }))
}

module.exports = getTeamData

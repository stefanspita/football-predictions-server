const {tap} = require("ramda")
const {getListOfTeamFixtures} = require("../../services/website")

function getTeamData(lastUpdatedGw, team) {
  return getListOfTeamFixtures(team.id)
    .then(tap(() => console.log(`Fetched team update for ${team.name}`)))
    .then((fixtures) => ({
      id: team.id,
      name: team.name,
      fixtures,
      lastUpdatedGw,
    }))
}

module.exports = getTeamData

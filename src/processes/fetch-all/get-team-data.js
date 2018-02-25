const Promise = require("bluebird")
const {getListOfTeamFixtures, exitPlayerModal} = require("../../services/website")

function getTeamData(session, teams) {
  return Promise.mapSeries(teams, (team) => {
    return getListOfTeamFixtures(session, team.id)
      .then((fixtures) => ({
        id: team.id,
        name: team.name,
        fixtures,
      }))
      .tap(() => console.log(`Fetched team update for ${team.name}`))
      .tap(() => exitPlayerModal(session))
      .catch((err) => {
        console.log(`Error occurred getting data for ${team.name}`)
        throw err
      })
  })
}

module.exports = getTeamData

const Promise = require("bluebird")
const R = require("ramda")
const {statisticsPage, playerDetailsModal} = require("../../services/website")

const getLastRound = R.compose(
  R.dec,
  R.reduce(R.min, 38),
  R.pluck("round"),
)

function getTeamData(session, teams) {
  return Promise.mapSeries(teams, (team) => {
    return statisticsPage.openPlayerDetailModal(session, team.id, 0)
      .then(() => playerDetailsModal.getListOfTeamFixtures(session))
      .then((fixtures) => {
        const lastUpdatedGameweek = getLastRound(fixtures)
        return {
          id: team.id,
          name: team.name,
          fixtures,
          lastUpdatedGameweek,
        }
      })
      .tap(() => console.log(`Fetched team update for ${team.name}`))
      .tap(() => playerDetailsModal.exitPlayerModal(session))
      .catch((err) => {
        console.log(`Error occurred getting data for ${team.name}`)
        throw err
      })
  })
}

module.exports = getTeamData

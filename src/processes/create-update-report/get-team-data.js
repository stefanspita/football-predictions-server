const {openTeamFixturesPage} = require("./website/methods")

function getTeamData(team) {
  return openTeamFixturesPage(team.id)
    .end()
}

module.exports = getTeamData

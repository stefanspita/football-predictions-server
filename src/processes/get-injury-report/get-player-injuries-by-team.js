const {getListOfInjuredPlayers} = require("../../services/website/methods")

module.exports = function getPlayerInjuriesByTeam(team) {
  return getListOfInjuredPlayers(team.id)
    .then((quack) => console.log("QUACK", quack))
}

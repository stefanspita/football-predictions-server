const Promise = require("bluebird")

function updateTeamsFile(db, fs) {
  const teamsCollection = db.collection("teams")
  return teamsCollection.find({}, {_id: 0}).sort({id: 1}).toArray()
    .then((teams) => fs.writeJson("./teams.json", teams))
}

function updatePlayersFile(db, fs) {
  const playersCollection = db.collection("players")
  return playersCollection.find({}, {_id: 0}).sort({position: 1, "thisSeason.points": -1}).toArray()
    .then((players) => fs.writeJson("./players.json", players))
}

module.exports = function updatePlayers(db, fs) {
  return Promise.all([
    updateTeamsFile(db, fs),
    updatePlayersFile(db, fs),
  ])
}

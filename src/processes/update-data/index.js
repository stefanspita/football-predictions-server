const Promise = require("bluebird")
const fs = require("fs-extra")
const getDb = require("../../init/db")
const updateTeams = require("./update-teams")
const updatePlayers = require("./update-players")
const updateLocalFiles = require("./update-local-files")

const TEAMS_FILE_PATH = "./teams-update.json"
const PLAYERS_FILE_PATH = "./players-update.json"

function updateDb() {
  return Promise.all([
    getDb(),
    fs.readJson(TEAMS_FILE_PATH),
    fs.readJson(PLAYERS_FILE_PATH),
  ]).spread((db, teamsUpdate, playersUpdate) => {
    return Promise.all([
      updateTeams(db, teamsUpdate),
      updatePlayers(db, playersUpdate),
    ]).then(() => updateLocalFiles(db, fs))
  }).then(() => {
    console.log("FINISHED UPDATING DB")
    process.exit(0)
  }).catch((err) => {
    console.error("ERROR OCCURRED", err)
    process.exit(1)
  })
}

updateDb()

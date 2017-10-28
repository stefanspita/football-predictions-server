const getDb = require("../../init/db")
const teams = require("./teams")

function updateTeams(db, teams) {
  const teamsCollection = db.collection("teams")
  return teamsCollection.deleteMany().then(() => {
    return teamsCollection.insertMany(teams).then(() => {
      return teamsCollection.createIndex({id: 1}, {unique: true})
    })
  })
}

function runInitDb() {
  return getDb().then((db) => {
    return Promise.all([
      updateTeams(db, teams),
    ])
  }).then(() => {
    console.log("FINISHED UPDATING DB")
    process.exit(0)
  }).catch((err) => {
    console.err("ERROR OCCURRED", err)
    process.exit(1)
  })
}

runInitDb()

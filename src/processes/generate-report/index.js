const Promise = require("bluebird")
const json2csv = require("json2csv")
const fs = require("fs-extra")
const {assoc, compose, converge, dissoc, keys, merge, mergeAll, pick} = require("ramda")
const getDb = require("../../init/db")
const calculatePlayerRatings = require("./calculate-player-ratings")
const calculatePlayingChance = require("./calculate-playing-chance")
const calculateRatingConfidence = require("./calculate-rating-confidence")

function generateReport() {
  return getDb().then((db) => {
    const teamsCollection = db.collection("teams")
    const playersCollection = db.collection("players")
    return Promise.all([
      teamsCollection.find().project({_id: 0}).toArray(),
      playersCollection.find().project({_id: 0}).toArray(),
    ])
  }).spread((teams, players) => {
    return Promise.map(players, (player) => {
      return compose(
        merge(pick(["id", "name", "teamId", "position"], player)),
        converge(
          (...reports) => mergeAll(reports),
          [calculatePlayerRatings, calculatePlayingChance, calculateRatingConfidence]
        )
      )(player)
    })
  }).then((playerReports) => {
    return Promise.map(playerReports, (report) => {
      return compose(
        dissoc("playingChance"),
        assoc("overallRating", report.rating * report.playingChance / 100)
      )(report)
    })
  }).then((finalReport) => {
    const fields = keys(finalReport[0])
    const csvReport = json2csv({data: finalReport, fields})
    return fs.outputFile("./player-report.csv", csvReport)
  }).then(() => {
    console.log("FINISHED COMPILING PLAYER REPORT")
    process.exit(0)
  }).catch((err) => {
    console.error("ERROR OCCURRED", err)
    process.exit(1)
  })
}

generateReport()

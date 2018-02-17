const Promise = require("bluebird")
const json2csv = require("json2csv")
const fs = require("fs-extra")
const {
  compose, converge, descend, find, merge, mergeAll, pick, prop, propEq, sortWith,
} = require("ramda")
const getDb = require("../../init/db")
const reportOptions = require("./report-options")
const calculatePlayerRatings = require("./calculate-player-ratings")
const calculatePlayingChance = require("./calculate-playing-chance")
const calculateRatingConfidence = require("./calculate-rating-confidence")
const calculateFixturesDifficulty = require("./calculate-fixtrues-difficulty")
const calculatePriceGrade = require("./calculate-price-grade")
const getDerivedPlayerStats = require("./calculate-derived-data")

const getInitialPlayerStats = converge(
  (...reports) => mergeAll(reports),
  [calculatePlayerRatings, calculatePlayingChance, calculateRatingConfidence, calculateFixturesDifficulty, calculatePriceGrade]
)

function generateReport(teams, playersCollection, reportType) {
  return playersCollection.find(reportType.filter).project({_id: 0}).toArray()
    .then((players) => {
      return Promise.map(players, (player) => {
        const team = find(propEq("id", player.teamId), teams)
        return compose(
          merge(pick(["name", "price", "position", "owned", "rating"], player)),
          getInitialPlayerStats
        )(player, team)
      })
    })
    .then((playerReports) => Promise.map(playerReports, getDerivedPlayerStats))
    .then((playerReports) => {
      return sortWith([
        descend(prop("grade")),
        descend(prop("overallRating")),
      ], playerReports)
    })
    .then((finalReport) => {
      const fields = reportType.fields
      const csvReport = json2csv({data: finalReport, fields})
      return fs.outputFile(`./${reportType.fileName}.csv`, csvReport)
    })
}

function generateReports() {
  return getDb().then((db) => {
    const teamsCollection = db.collection("teams")
    const playersCollection = db.collection("players")
    return teamsCollection.find().project({_id: 0}).toArray().then((teams) => {
      return Promise.map(
        reportOptions,
        (reportType) => generateReport(teams, playersCollection, reportType)
      )
    })
  }).then(() => {
    console.log("FINISHED COMPILING PLAYER REPORT")
    process.exit(0)
  }).catch((err) => {
    console.error("ERROR OCCURRED", err)
    process.exit(1)
  })
}

generateReports()

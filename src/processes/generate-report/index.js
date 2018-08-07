const Promise = require("bluebird")
const {parse: json2csv} = require("json2csv")
const fs = require("fs-extra")
const {
  both, compose, converge, descend, filter, find, lt, merge, mergeAll, pick, prop, propEq, sortWith,
} = require("ramda")
const getDb = require("../../init/db")
const reportsOptions = require("./report-options")
const calculatePlayerRatings = require("./calculate-player-ratings")
const calculatePlayingChance = require("./calculate-playing-chance")
const calculateRatingConfidence = require("./calculate-rating-confidence")
const calculateFixturesDifficulty = require("./calculate-fixtures-difficulty")
const calculatePriceGrade = require("./calculate-price-grade")
const getDerivedPlayerStats = require("./get-derived-player-stats")
const calculateSelectionPercentGrade = require("./calculate-selection-percent-grade")

const getInitialPlayerStats = converge(
  (...reports) => mergeAll(reports),
  [
    calculatePlayerRatings,
    calculatePlayingChance,
    calculateRatingConfidence,
    calculateFixturesDifficulty,
    calculatePriceGrade,
    calculateSelectionPercentGrade,
  ]
)

function calculatePlayerStats(player, team) {
  const playerMeta = pick(["name", "price", "position", "owned", "rating"], player)

  return compose(
    getDerivedPlayerStats,
    merge(playerMeta),
    getInitialPlayerStats
  )(player, team)
}

const ratingLowerThan50 = compose(lt(50), prop("overallRating"))
const gradeLowerThan15 = compose(lt(15), prop("grade"))
const filterLowScores = both(ratingLowerThan50, gradeLowerThan15)

function generateReport(teams, playersCollection, reportOptions) {
  return playersCollection.find(reportOptions.filter).project({_id: 0}).toArray()
    .then((players) => {
      return Promise.map(players, (player) => {
        const team = find(propEq("id", player.teamId), teams)
        return calculatePlayerStats(player, team)
      })
    })
    .then(filter(filterLowScores))
    .then(sortWith([
      descend(prop("grade")),
      descend(prop("overallRating")),
    ]))
    .then((finalReport) => {
      const options = {fields: reportOptions.fields}
      const csvReport = json2csv(finalReport, options)
      return fs.outputFile(`./${reportOptions.fileName}.csv`, csvReport)
    })
}

function generateReports() {
  return getDb().then((db) => {
    const teamsCollection = db.collection("teams")
    const playersCollection = db.collection("players")
    return teamsCollection.find().project({_id: 0}).toArray().then((teams) => {
      return Promise.map(
        reportsOptions,
        (reportOptions) => generateReport(teams, playersCollection, reportOptions)
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

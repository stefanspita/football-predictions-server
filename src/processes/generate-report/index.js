const Promise = require("bluebird")
const json2csv = require("json2csv")
const fs = require("fs-extra")
const {assoc, compose, converge, descend, find, keys, merge, mergeAll, pick, prop, propEq, sortWith} = require("ramda")
const getDb = require("../../init/db")
const reportTypes = require("./report-types")
const calculatePlayerRatings = require("./calculate-player-ratings")
const calculatePlayingChance = require("./calculate-playing-chance")
const calculateRatingConfidence = require("./calculate-rating-confidence")
const calculateFixturesDifficulty = require("./calculate-fixtrues-difficulty")

function round(value) {
  return Number(Math.round(value + "e" + 2) + "e-" + 2)
}

function generateReport(teams, playersCollection, reportType) {
  return playersCollection.find(reportType.filter).project({_id: 0}).toArray()
    .then((players) => {
      return Promise.map(players, (player) => {
        const team = find(propEq("id", player.teamId), teams)
        return compose(
          merge(pick(["id", "name", "price", "position", "owned"], player)),
          converge(
            (...reports) => mergeAll(reports),
            [calculatePlayerRatings, calculatePlayingChance, calculateRatingConfidence, calculateFixturesDifficulty]
          )
        )(player, team)
      })
    })
    .then((playerReports) => {
      return Promise.map(playerReports, (report) => {
        const grade = report.fixtureDifficulty_3_grade + report.fixtureDifficulty_5_grade + report.rating_grade

        return compose(
          assoc("grade", grade),
          assoc("overallRating", round(report.rating * report.playingChance / 100)),
          assoc("owned", report.owned ? "owned" : ""),
          pick(["name", "price", "position"])
        )(report)
      })
    })
    .then((playerReports) => {
      return sortWith([
        descend(prop("grade")),
        descend(prop("overallRating")),
      ], playerReports)
    })
    .then((finalReport) => {
      const fields = keys(finalReport[0])
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
        reportTypes,
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

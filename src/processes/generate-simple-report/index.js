const Promise = require("bluebird")
const R = require("ramda")
const {parse: json2csv} = require("json2csv")
const fs = require("fs-extra")

const getDb = require("../../init/db")
const reportsOptions = require("./report-options")

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals)
}

const getNumberOfGames = R.pipe(
  R.reject(R.propEq("unavailable", true)),
  R.length,
)

const getTotalPoints = R.pipe(
  R.pluck("points"),
  R.sum,
)

function calculatePlayerStats(player) {
  const numberOfGames = getNumberOfGames(player.currentSeason)
  const totalPoints = getTotalPoints(player.currentSeason)
  const pointsPerGame = round(totalPoints / numberOfGames, 2)
  const owned = player.owned ? "owned" : ""
  return R.merge(player, {pointsPerGame, owned})
}

function generateReport(playersCollection, reportOptions) {
  return playersCollection.find(reportOptions.filter).project({_id: 0}).toArray()
    .then((players) => {
      return players.map((player) => calculatePlayerStats(player))
    })
    .then(R.sortWith([
      R.descend(R.prop("pointsPerGame")),
    ]))
    .then((report) => {
      const options = {fields: reportOptions.fields}
      const csvReport = json2csv(report, options)
      return fs.outputFile(`./${reportOptions.fileName}.csv`, csvReport)
    })
}

function generateReports() {
  return getDb().then((db) => {
    const playersCollection = db.collection("players")

    return Promise.map(
      reportsOptions,
      (reportOptions) => generateReport(playersCollection, reportOptions),
    )
  }).then(() => {
    console.log("FINISHED COMPILING PLAYER REPORT")
    process.exit(0)
  }).catch((err) => {
    console.error("ERROR OCCURRED", err)
    process.exit(1)
  })
}

generateReports()

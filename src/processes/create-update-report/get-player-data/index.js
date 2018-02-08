const {Chromeless} = require("chromeless")

function getPlayerData() {
  const chromeless = new Chromeless()
  return chromeless
    .goto("https://fantasy.premierleague.com/a/statistics/total_points")
    .evaluate(() => {
      document.querySelectorAll(".ism-table--el__name")
    })
    .end()
    .then((screenshot) => {
      console.log(screenshot) // prints local file path or S3 url
    })

}

module.exports = getPlayerData

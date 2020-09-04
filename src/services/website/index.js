const Promise = require("bluebird")
const Nightmare = require("nightmare")
const statisticsPage = require("./statistics")
const playerDetailsModal = require("./player-details-modal")

function openWebsite() {
  const nightmare = new Nightmare({Promise})
  return nightmare
    .goto("https://fantasy.premierleague.com/statistics")
    .inject("js", "node_modules/jquery/dist/jquery.min.js")
}


module.exports = {
  openWebsite, statisticsPage, playerDetailsModal,
}

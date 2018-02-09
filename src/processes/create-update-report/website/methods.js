const Promise = require("bluebird")
const Nightmare = require("nightmare")
const selectors = require("./selectors")

const MODAL_OPENING_WAIT_TIME_MS = 100

function openWebsite() {
  const nightmare = new Nightmare({show: true, Promise})
  return nightmare
    .goto("https://fantasy.premierleague.com/a/statistics/total_points")

}

function openTeamFixturesPage(teamId) {
  return openWebsite()
    .select(selectors.TEAM_LIST_SELECTBOX_SELECTOR, teamId)
    .click(selectors.PLAYER_TABLE_ROW_SELECTOR)
    .wait(MODAL_OPENING_WAIT_TIME_MS)
    .click(selectors.PLAYER_FIXTURES_TAB_SELECTOR)
    .wait(5000)
}

module.exports = {
  openTeamFixturesPage,
  openWebsite,
}

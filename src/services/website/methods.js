const Promise = require("bluebird")
const Nightmare = require("nightmare")
const selectors = require("./selectors")

function openWebsite() {
  const nightmare = new Nightmare({Promise})
  return nightmare
    .goto("https://fantasy.premierleague.com/a/statistics/total_points")
}

function getListOfTeams() {
  return openWebsite()
    .evaluate((teamsSelector) => {
      const teams = Array.from(document.querySelectorAll(teamsSelector))
      return teams.map((elem) => ({id: elem.value, name: elem.innerText}))
    }, selectors.TEAM_OPTIONS_IN_SELECTBOX)
    .end()
}

function getListOfTeamFixtures(teamId) {
  return openWebsite()
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .click(selectors.PLAYER_TABLE_ROW)
    .wait(selectors.PLAYER_FIXTURES_TAB)
    .click(selectors.PLAYER_FIXTURES_TAB)
    .evaluate((fixturesSelector) => {
      const fixtures = Array.from(document.querySelectorAll(fixturesSelector))
      return fixtures.map((elem) => parseInt(elem.innerText, 10))
    }, selectors.NEXT_5_TEAM_FIXTURES)
    .end()
}

function getListOfInjuredPlayers(teamId) {
  return openWebsite()
    .select(selectors.TEAM_LIST_SELECTBOX, teamId)
    .click(selectors.PLAYER_TABLE_ROW)
    .evaluate((injurySelector) => {
      const fixtures = Array.from(document.querySelectorAll(injurySelector))
      return fixtures.map((elem) => parseInt(elem.innerText, 10))
    }, selectors.PLAYER_INJURY)
    .end()
}

module.exports = {getListOfTeamFixtures, getListOfTeams, getListOfInjuredPlayers}

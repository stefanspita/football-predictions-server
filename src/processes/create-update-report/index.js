const Promise = require("bluebird")
const {openWebsite} = require("./website/methods")
const {TEAM_OPTIONS_IN_SELECTBOX_SELECTOR} = require("./website/selectors")
const getTeamData = require("./get-team-data")

function getListOfTeams() {
  return openWebsite()
    .evaluate((teamsSelector) => {
      const teams = Array.from(document.querySelectorAll(teamsSelector))
      return teams.map((element) => ({id: element.value, name: element.innerText}))
    }, TEAM_OPTIONS_IN_SELECTBOX_SELECTOR)
    .end()
}

function createUpdateReport() {
  return getListOfTeams()
    .then((teams) => Promise.map([teams[0]], (team) => {
      return getTeamData(team)
    }))
    .catch((err) => console.log("Error occurred", err))
}

createUpdateReport()

const Promise = require("bluebird")
const {assoc, map} = require("ramda")
const {getFixturesForTeam, openWebsite} = require("../open-website")
const {getLastNumberFromString} = require("../get-numbers-from-string")

function getTeamsFromSelectBox() {
  return openWebsite()
    .evaluate(() => {
      const teams = Array.from(document.querySelectorAll("optgroup[label='By Team'] option"))
      return teams.map((element) => ({selectValue: element.value, name: element.innerText}))
    })
    .end()
    .then((teams) => {
      return map(
        (team) => assoc("id", getLastNumberFromString(team.selectValue), team)
        , teams
      )
    })
}

function getTeamsData() {
  return Promise.resolve()
    .then(() => getTeamsFromSelectBox())
    .then((teams) => {
      return Promise.map([teams[0]], (team) => {
        return getFixturesForTeam(team.selectValue)
      })
    })
    .catch((err) => console.log("Error occurred", err))
}

module.exports = getTeamsData

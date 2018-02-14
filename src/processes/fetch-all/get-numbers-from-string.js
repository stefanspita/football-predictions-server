const {compose, head} = require("ramda")

const NUMBER_PATTERN = /\d+/g

function getNumbersFromString(string) {
  return string.match(NUMBER_PATTERN)
}

function getLastNumberFromString(string) {
  return compose(
    head,
    getNumbersFromString
  )(string)
}

module.exports = {
  getNumbersFromString, getLastNumberFromString,
}

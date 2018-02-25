/* global $ */
const selectors = require("./selectors")

function exitPlayerModal(session) {
  return session.click(selectors.OVERLAY)
}

module.exports = {exitPlayerModal}

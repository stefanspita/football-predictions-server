/* eslint-disable max-nested-callbacks */
const {expect} = require("chai")
const {getTeamDetails} = require("../get")

describe("Teams service - get", function() {
  describe("get team details", () => {
    it("gets the team details by id", () => {
      const team = getTeamDetails(1)
      expect(team.id).to.eql(1)
      expect(team.name).to.eql("Manchester City")
    })

    it("throws error if team not found", () => {
      expect(() => {
        getTeamDetails(50)
      }).to.throw("Team id 50 not found")
    })
  })
})

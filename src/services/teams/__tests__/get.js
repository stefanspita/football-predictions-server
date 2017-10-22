/* eslint-disable max-nested-callbacks */
const {expect} = require("chai")
const getTeamsService = require("../get")

const teams = [
  {id: 1, name: "Manchester City", fixtures: [2, 4, 3, 2, 2]},
]

const {getTeamDetails, getTeamNextFixtures} = getTeamsService(teams)


describe("Teams service - get", function() {
  describe("getTeamDetails", () => {
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

  describe("getTeamNextFixtures", () => {
    it("gets the first fixture", () => {
      const result = getTeamNextFixtures(1, 1)
      expect(result).to.eql(2)
    })

    it("gets the sum of the first 3 fixtures", () => {
      const result = getTeamNextFixtures(1, 3)
      expect(result).to.eql(9)
    })

    it("gets the sum of all 5 fixtures", () => {
      const result = getTeamNextFixtures(1, 5)
      expect(result).to.eql(13)
    })

    it("throws an appropriate error if the number of fixtures requested is not in range", () => {
      expect(() => {
        getTeamNextFixtures(1, 6)
      }).to.throw("Number of fixtures has to be a number between 1 and 5. Currently it's 6")
    })
  })
})

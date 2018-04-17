const {last} = require("ramda")
const {expect} = require("chai")
const {FIXTURE_DIFFICULTY_GROUPS} = require("../rules")
const calculateFixturesDifficulty = require("../calculate-fixtures-difficulty")

const lastUpdatedGameweek = 30

describe("calculateFixturesDifficulty", function() {
  describe("grades next fixture's difficulty correclty", () => {
    it("for lowest difficulty", () => {
      const fixtures = [{round: 31, difficulty: 1}]
      const {fixtureDifficulty_1_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_1_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[0].points)
    })

    it("for highest difficulty", () => {
      const fixtures = [{round: 31, difficulty: 5}]
      const {fixtureDifficulty_1_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_1_grade).to.eql(last(FIXTURE_DIFFICULTY_GROUPS).points)
    })
  })

  describe("grades next 3 fixtures' difficulty correclty", () => {
    it("for lowest difficulty", () => {
      const fixtures = [{round: 31, difficulty: 1}, {round: 32, difficulty: 1}, {round: 33, difficulty: 2}]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_3_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[0].points)
    })

    it("for highest difficulty", () => {
      const fixtures = [{round: 31, difficulty: 5}, {round: 32, difficulty: 5}, {round: 33, difficulty: 5}]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_3_grade).to.eql(last(FIXTURE_DIFFICULTY_GROUPS).points)
    })
  })

  describe("grades next fixtures' difficulty correctly if less than 3 fixtures available", () => {
    it("for medium difficulty", () => {
      const fixtures = [{round: 31, difficulty: 2}, {round: 32, difficulty: 2}]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_3_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[1].points * 2 / 3)
    })
  })

  describe("grades next fixtures' difficulty correctly if more than 3 fixtures available", () => {
    it("for medium difficulty", () => {
      const fixtures = [{round: 31, difficulty: 2}, {round: 32, difficulty: 2}, {round: 32, difficulty: 2}, {round: 33, difficulty: 2}]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_3_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[1].points * 4 / 3)
    })
  })

  describe("grades next fixture difficulty correctly if there's no game next round", () => {
    it("for medium difficulty", () => {
      const fixtures = [{round: 32, difficulty: 2}]
      const {fixtureDifficulty_1_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_1_grade).to.eql(0)
    })
  })

  describe("grades next fixture difficulty correctly if there's 2 games next round", () => {
    it("for medium difficulty", () => {
      const fixtures = [{round: 31, difficulty: 2}, {round: 31, difficulty: 2}]
      const {fixtureDifficulty_1_grade} = calculateFixturesDifficulty(undefined, {fixtures, lastUpdatedGameweek})
      expect(fixtureDifficulty_1_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[1].points * 2)
    })
  })
})

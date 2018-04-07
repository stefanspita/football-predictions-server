const {last} = require("ramda")
const {expect} = require("chai")
const {FIXTURE_DIFFICULTY_GROUPS} = require("../rules")
const calculateFixturesDifficulty = require("../calculate-fixtures-difficulty")

describe("calculateFixturesDifficulty", function() {
  describe("grades next fixture's difficulty correclty", () => {
    it("for lowest difficulty", () => {
      const fixtures = [1]
      const {fixtureDifficulty_1_grade} = calculateFixturesDifficulty(undefined, {fixtures})
      expect(fixtureDifficulty_1_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[0].points)
    })
    it("for highest difficulty", () => {
      const fixtures = [5]
      const {fixtureDifficulty_1_grade} = calculateFixturesDifficulty(undefined, {fixtures})
      expect(fixtureDifficulty_1_grade).to.eql(last(FIXTURE_DIFFICULTY_GROUPS).points)
    })
  })

  describe("grades next 3 fixtures' difficulty correclty", () => {
    it("for lowest difficulty", () => {
      const fixtures = [1, 1, 2]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures})
      expect(fixtureDifficulty_3_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[0].points)
    })
    it("for highest difficulty", () => {
      const fixtures = [5, 5, 5]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures})
      expect(fixtureDifficulty_3_grade).to.eql(last(FIXTURE_DIFFICULTY_GROUPS).points)
    })
  })

  describe("grades next fixtures' difficulty correctly if less than 3 fixtures available", () => {
    it("for highest difficulty", () => {
      const fixtures = [5, 5]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures})
      expect(fixtureDifficulty_3_grade).to.eql(last(FIXTURE_DIFFICULTY_GROUPS).points)
    })

    it("for medium difficulty", () => {
      const fixtures = [2, 2]
      const {fixtureDifficulty_3_grade} = calculateFixturesDifficulty(undefined, {fixtures})
      expect(fixtureDifficulty_3_grade).to.eql(FIXTURE_DIFFICULTY_GROUPS[1].points)
    })
  })
})

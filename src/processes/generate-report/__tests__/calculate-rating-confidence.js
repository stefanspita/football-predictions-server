const {expect} = require("chai")
const {LAST_SEASON, TWO_SEASONS_AGO, CONFIDENCE_GROUPS} = require("../rules")
const calculateRatingConfidence = require("../calculate-rating-confidence")

describe("calculate rating confidence", function() {
  it("works with empty data", () => {
    const previousSeasons = []
    const currentSeason = []
    const {confidence, confidence_grade} = calculateRatingConfidence({previousSeasons, currentSeason})
    expect(confidence).to.eql(0)
    expect(confidence_grade).to.eql(0)
  })

  it("works with previous seasons data only", () => {
    const previousSeasons = [{
      "minutesPlayed": 3000,
      "season": LAST_SEASON,
    }, {
      "minutesPlayed": 3000,
      "season": TWO_SEASONS_AGO,
    }]
    const currentSeason = []
    const {confidence, confidence_grade} = calculateRatingConfidence({previousSeasons, currentSeason})

    expect(confidence).to.not.eql(0)
    expect(confidence_grade).to.not.eql(0)
  })

  it("works with current season data only", () => {
    const previousSeasons = []
    const currentSeason = [{minutesPlayed: 3000}]
    const {confidence, confidence_grade} = calculateRatingConfidence({previousSeasons, currentSeason})

    expect(confidence).to.not.eql(0)
    expect(confidence_grade).to.not.eql(0)
  })

  it("works when all data provided", () => {
    const previousSeasons = [{
      "minutesPlayed": 3000,
      "season": LAST_SEASON,
    }, {
      "minutesPlayed": 3000,
      "season": TWO_SEASONS_AGO,
    }]
    const currentSeason = [{minutesPlayed: 3000}]
    const {confidence, confidence_grade} = calculateRatingConfidence({previousSeasons, currentSeason})

    expect(confidence).to.eql(100)
    expect(confidence_grade).to.eql(CONFIDENCE_GROUPS[0].points)
  })
})

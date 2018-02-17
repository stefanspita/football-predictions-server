const {expect} = require("chai")
const {LAST_SEASON, RATING_GROUPS} = require("../rules")
const calculatePlayerRating = require("../calculate-player-ratings")

describe.only("Calculate player ratings", function() {
  it("works with empty data", () => {
    const previousSeasons = []
    const currentSeason = []
    const {rating, rating_grade} = calculatePlayerRating({previousSeasons, currentSeason})

    expect(rating).to.eql(0)
    expect(rating_grade).to.eql(0)
  })

  it("works with current season data only", () => {
    const previousSeasons = []
    const currentSeason = [{
      "bps": 90,
      "minutesPlayed": 90,
      "points": 90,
      "round": 27,
    }]
    const {rating, rating_grade} = calculatePlayerRating({previousSeasons, currentSeason})

    expect(rating).to.eql(100)
    expect(rating_grade).to.eql(RATING_GROUPS[0].points)
  })

  it("works with previous season data only", () => {
    const previousSeasons = [{
      "bps": 90,
      "minutesPlayed": 90,
      "points": 90,
      "season": LAST_SEASON,
    }]
    const currentSeason = []
    const {rating, rating_grade} = calculatePlayerRating({previousSeasons, currentSeason})

    expect(rating).to.eql(100)
    expect(rating_grade).to.eql(RATING_GROUPS[0].points)
  })

  it("works with all data defined", () => {
    const previousSeasons = [{
      "bps": 90,
      "minutesPlayed": 90,
      "points": 90,
      "season": LAST_SEASON,
    }]
    const currentSeason = [{
      "bps": 90,
      "minutesPlayed": 90,
      "points": 90,
      "round": 10,
    }]
    const {rating, rating_grade} = calculatePlayerRating({previousSeasons, currentSeason})

    expect(rating).to.eql(100)
    expect(rating_grade).to.eql(RATING_GROUPS[0].points)
  })
})

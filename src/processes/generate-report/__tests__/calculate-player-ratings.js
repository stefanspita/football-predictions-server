const {expect} = require("chai")
const calculatePlayerRating = require("../calculate-player-ratings")

describe.only("Calculate player ratings", function() {
  it("works with empty data", () => {
    const previousSeasons = []
    const currentSeason = []
    const {rating, rating_grade} = calculatePlayerRating({previousSeasons, currentSeason})

    expect(rating).to.eql(0)
    expect(rating_grade).to.eql(0)
  })
})

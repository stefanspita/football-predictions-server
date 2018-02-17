const {expect} = require("chai")
const {PLAYING_CHANCE_GROUPS} = require("../rules")
const calculatePlayingChance = require("../calculate-playing-chance")

describe.only("calculate playing chance", function() {
  it("works with empty data", () => {
    const currentSeason = []
    const {playingChance, playingChance_grade} = calculatePlayingChance({currentSeason})
    expect(playingChance).to.eql(0)
    expect(playingChance_grade).to.eql(0)
  })

  it("works with valid data", () => {
    const currentSeason = [{minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90}]
    const {playingChance} = calculatePlayingChance({currentSeason})
    expect(playingChance).to.eql(50)
  })

  it("filters out rounds when player was unavailable", () => {
    const currentSeason = [
      {minutesPlayed: 0, unavailable: true}, {minutesPlayed: 90}, {minutesPlayed: 90},
      {minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90},
    ]
    const {playingChance, playingChance_grade} = calculatePlayingChance({currentSeason})
    expect(playingChance).to.eql(100)
    expect(playingChance_grade).to.eql(PLAYING_CHANCE_GROUPS[0].points)
  })
})

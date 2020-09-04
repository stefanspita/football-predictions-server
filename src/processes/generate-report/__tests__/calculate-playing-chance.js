const {expect} = require("chai")
const {PLAYING_CHANCE_GROUPS} = require("../rules")
const calculatePlayingChance = require("../calculate-playing-chance")

describe("calculate playing chance", function() {
  describe("when 6 games into the league", () => {
    it("works with empty data", () => {
      const currentSeason = []
      const previousSeasons = []
      const {playingChance, playingChance_grade} = calculatePlayingChance({currentSeason, previousSeasons})
      expect(playingChance).to.eql(0)
      expect(playingChance_grade).to.eql(0)
    })

    it("works when all games this season were played in", () => {
      const currentSeason = [{minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90}]
      const previousSeasons = []
      const {playingChance} = calculatePlayingChance({currentSeason, previousSeasons})
      expect(playingChance).to.eql(100)
    })

    it("works when 50% of the games played", () => {
      const currentSeason = [{minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90},
        {minutesPlayed: 0}, {minutesPlayed: 0}, {minutesPlayed: 0}]
      const previousSeasons = []
      const {playingChance} = calculatePlayingChance({currentSeason, previousSeasons})
      expect(playingChance).to.eql(50)
    })

    it("filters out rounds when player was unavailable", () => {
      const currentSeason = [
        {minutesPlayed: 0, unavailable: true}, {minutesPlayed: 90}, {minutesPlayed: 90},
        {minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90}, {minutesPlayed: 90},
      ]
      const previousSeasons = []
      const {playingChance, playingChance_grade} = calculatePlayingChance({currentSeason, previousSeasons})
      expect(playingChance).to.eql(100)
      expect(playingChance_grade).to.eql(PLAYING_CHANCE_GROUPS[0].points)
    })
  })

  describe("when less than 6 games into the league", () => {
    it("only uses the previous season before the start of a season", () => {
      const currentSeason = []
      const previousSeasons = [
        {
          "minutesPlayed": 3420,
          "season": "2019/20",
        },
      ]

      const {playingChance, playingChance_grade} = calculatePlayingChance({currentSeason, previousSeasons})
      expect(playingChance).to.eql(100)
      expect(playingChance_grade).to.eql(PLAYING_CHANCE_GROUPS[0].points)
    })

    it("uses both the previous season and the current season when 3 games in", () => {
      const currentSeason = [
        {minutesPlayed: 90}, {minutesPlayed: 90},
        {minutesPlayed: 0},
      ]
      const previousSeasons = [
        {
          "minutesPlayed": 3420 / 3,
          "season": "2019/20",
        },
      ]

      const {playingChance, playingChance_grade} = calculatePlayingChance({currentSeason, previousSeasons})
      expect(Math.round(playingChance)).to.eql(50)
      expect(playingChance_grade).to.eql(PLAYING_CHANCE_GROUPS[5].points)
    })
  })
})

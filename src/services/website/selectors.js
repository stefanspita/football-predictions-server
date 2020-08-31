module.exports = {
  TEAM_LIST_SELECTBOX: "#filter",
  PLAYER_ROW: "#root table tbody tr",
  PLAYER_ID: "td:nth-child(2) button div div div:nth-child(1)",
  PLAYER_INFO: "td:nth-child(1) button",
  PLAYER_FIXTURES_TAB: "a[href='#fixtures']",
  UNAVAILABLE_PLAYERS: ".ism-icon--status-75, .ism-icon--status-50, .ism-icon--status-25, .ism-icon--status-0",
  TEAM_OPTIONS_IN_SELECTBOX: "optgroup[label='By Team'] option",
  OVERLAY: "#root-dialog div[role=\"presentation\"]",

  // first 5 rows, last column
  TEAM_FIXTURES_ROWS: "#root-dialog table tr",
  TEAM_FIXTURE_ROUND: "td:eq(1)",
  TEAM_FIXTURE_DIFFICULTY: "td:eq(3)",

  // player stats inside dialog
  PLAYER_NAME: "#root-dialog h2",
  PLAYER_POSITION: "span:first",
  PLAYER_PRICE: "ul li div:contains(£)",
  PLAYER_SELECTED_PERCENTAGE: "ul li div:contains(%)",

  PREVIOUS_SEASONS: "table[class*='HistoryTable'] tbody tr",
  PREVIOUS_SEASON_NAME: "td:eq(0)",
  PREVIOUS_SEASON_POINTS: "td:eq(1)",
  PREVIOUS_SEASON_MINUTES_PLAYED: "td:eq(2)",
  PREVIOUS_SEASON_BONUS_POINTS: "td:eq(14)",

  CURRENT_SEASON: "#ismr-element-history-this tbody:eq(0) tr",
  CURRENT_SEASON_ROUND: "td:eq(0)",
  CURRENT_SEASON_POINTS: "td:eq(2)",
  CURRENT_SEASON_MINUTES_PLAYED: "td:eq(3)",
  CURRENT_SEASON_BONUS_POINTS: "td:eq(15)",
}

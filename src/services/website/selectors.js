module.exports = {
  TEAM_LIST_SELECTBOX: "#filter",
  PLAYER_ROW: "#root table tbody tr",
  PLAYER_ID: "td:nth-child(2) div[class*='ElementInTable__Name']",
  PLAYER_INFO: "td:nth-child(1) button[class*='ElementDialogButton']",
  PLAYER_FIXTURES_TAB: "a[href='#fixtures']",
  UNAVAILABLE_PLAYERS: "td:nth-child(1) svg[class*='StyledStatus']",
  TEAM_OPTIONS_IN_SELECTBOX: "optgroup[label='By Team'] option",
  OVERLAY: "#root-dialog div[class*='Dialog__Overlay']",

  // first 5 rows, last column
  TEAM_FIXTURES_ROWS: "#root-dialog table tr",
  TEAM_FIXTURE_ROUND: "td:eq(1)",
  TEAM_FIXTURE_DIFFICULTY: "td:eq(3)",

  // player stats inside dialog
  PLAYER_NAME: "#root-dialog h2[class*='ElementDialog__ElementHeading']",
  PLAYER_POSITION: "#root-dialog span[class*='ElementDialog__ElementTypeLabel']",
  PLAYER_PRICE: "ul li[class*='ElementDialog__StatItem'] div:contains(£)",
  PLAYER_SELECTED_PERCENTAGE: "ul li[class*='ElementDialog__StatItem'] div:contains(%)",

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

module.exports = {
  TEAM_LIST_SELECTBOX: "#ismjs-stats-filter",
  PLAYER_ROW_ID: ".ism-table--el__name",
  PLAYER_FIXTURES_TAB: "a[href='#ism-eiw-fixtures']",
  UNAVAILABLE_PLAYERS: ".ism-icon--status-75, .ism-icon--status-50, .ism-icon--status-25, .ism-icon--status-0",
  TEAM_OPTIONS_IN_SELECTBOX: "optgroup[label='By Team'] option",

  // first 5 rows, last column
  NEXT_5_TEAM_FIXTURES: "#ism-eiw-fixtures table tr:nth-child(-n+5) td:last-child",


  // player dialog
  PLAYER_NAME: "#ismjs-dialog-title",
  PLAYER_POSITION: ".properties__body__primary .ism-el-type",

  // value selectors depend on heading selectors
  PLAYER_PRICE_HEADING: "h3:contains(Price)",
  PLAYER_SELECTED_PERCENTAGE_HEADING: "h3:contains(TSB)",
  HEADING_VALUE: "ism-horizontal-data-list--basic__value",

  PREVIOUS_SEASONS: "td:contains(2015/16), td:contains(2016/17)",
  PREVIOUS_SEASONS_CELLS: "td:eq(0), td:eq(1), td:eq(2), td:eq(14)",
}

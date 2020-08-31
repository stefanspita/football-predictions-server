const {compose, curry, find, prop} = require("ramda")

module.exports = {
  findGradeAscending: curry((difficulty, groups) => {
    return compose(
      prop("points"),
      find((group) => {
        if (difficulty <= group.value) return true
        return false
      }),
    )(groups)
  }),

  findGradeDescending: curry((difficulty, groups) => {
    return compose(
      prop("points"),
      find((group) => {
        if (difficulty >= group.value) return true
        return false
      }),
    )(groups)
  }),
}

const baseFields = ["name", "price", "position", "owned", "overallRating", "grade"]

module.exports = [
  {filter: {owned: true}, fields: ["name", "price", "position", "grade", "overallRating", "rating", "nextGameGrade"], fileName: "my-team"},
  {filter: {position: "gk"}, fields: baseFields, fileName: "gk"},
  {filter: {position: "def"}, fields: baseFields,  fileName: "def"},
  {filter: {position: "mid"}, fields: baseFields,  fileName: "mid"},
  {filter: {position: "fwd"}, fields: baseFields,  fileName: "fwd"},
]

const baseFields = ["name", "price", "position", "owned", "overallRating", "grade"]

module.exports = [
  {filter: {owned: true}, fields: ["name", "price", "position", "grade", "overallRating", "rating", "nextGameGrade"], fileName: "my-team"},
  {filter: {position: "Goalkeeper"}, fields: baseFields, fileName: "gk"},
  {filter: {position: "Defender"}, fields: baseFields,  fileName: "def"},
  {filter: {position: "Midfielder"}, fields: baseFields,  fileName: "mid"},
  {filter: {position: "Forward"}, fields: baseFields,  fileName: "fwd"},
]

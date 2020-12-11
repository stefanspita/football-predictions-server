const baseFields = ["name", "position", "owned", "price", "pointsPerGame"]

module.exports = [
  {filter: {position: "Goalkeeper"}, fields: baseFields, fileName: "gk"},
  {filter: {position: "Defender"}, fields: baseFields,  fileName: "def"},
  {filter: {position: "Midfielder"}, fields: baseFields,  fileName: "mid"},
  {filter: {position: "Forward"}, fields: baseFields,  fileName: "fwd"},
]

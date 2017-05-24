module.exports = function pingTestFactory(server, db) {
  server.get("/pingTest", function(req, res) {
    return db.collection("leagues").findOne().then(() => {
      res.send(200)
    })
  })
}

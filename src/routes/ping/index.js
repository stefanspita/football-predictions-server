module.exports = function pingTestFactory(server) {
  server.get("/pingTest", function(req, res) {
    res.send(200)
  })
}

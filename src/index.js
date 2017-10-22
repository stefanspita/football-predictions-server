const restify = require("restify")
const {port} = require("config")
const {name, version} = require("../package.json")
const pingRoute = require("./routes/ping")
const getDb = require("./init/db")

const server = restify.createServer({name, version})

server.on("uncaughtException", (req, res, route, err) => {
  console.error("uncaughtException", err)
  throw err
})

server.use(restify.plugins.authorizationParser())
server.use(restify.plugins.bodyParser({mapParams: true}))
server.use(restify.plugins.queryParser({mapParams: false}))
server.pre(restify.pre.sanitizePath())

return getDb().then((db) => {
  pingRoute(server, db)

  server.listen(port, function() {
    console.log(`Server started listening on port ${port}`)
  })
})

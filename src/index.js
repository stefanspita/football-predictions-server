const restify = require("restify")
const {name, version} = require("../package.json")

const server = restify.createServer({name, version})

server.on("uncaughtException", (req, res, route, err) => {
  console.error("uncaughtException", err)
  throw err
})

server.use(restify.authorizationParser())
server.use(restify.bodyParser({mapParams: false}))
server.use(restify.queryParser({mapParams: false}))
server.pre(restify.pre.sanitizePath())

server.listen(10002, function() {
  console.log("Server started listening on port 10002")
})

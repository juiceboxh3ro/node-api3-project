const port = process.env.PORT || 5050

const server = require('./server.js')

server.listen(port, () => {
  console.log(`Whaddup I'm on ${port} boi`)
})
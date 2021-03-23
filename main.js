const { log } = console
const port = process.argv[2] || 3000

// Biblioteker
var express = require("express")
var app = express()
var http = require("http").createServer(app)

app.use(express.static("public"))

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/404.html')
})

http.listen(port, () => {
	log(`AirBorne er åben på port: ${ port }! Wuhuuu!`)
})
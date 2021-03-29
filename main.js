const { log } = console
const { execSync } = require('child_process')
const { readFileSync } = require('fs')
const crypto = require('crypto')

const pm2_id = process.argv[2] || null
const port = process.argv[3] || 3000


// Biblioteker
const express = require("express")
const bodyParser = require("body-parser")
const webhookMiddleware = require('x-hub-signature').middleware
const app = express()
const http = require("http").createServer(app)


// Github verifikation
try {
	var secret = readFileSync('webhook_secret', 'utf8')
	if (secret.includes('\n')) secret = secret.split('\n')[0]
}
catch (err) {
	log("webhook_secret mangler!")
	process.exit()
}

app.use(bodyParser.json({
	verify: webhookMiddleware.extractRawBody
}))
app.use('/gitevent', webhookMiddleware({
	algorithm: 'sha1',
	secret: secret,
	require: true
}))
app.use('/gitevent', (req, res) => {
	res.send('ok')
	execSync('git pull')
	if (pm2_id)
		execSync(`pm2 restart ${pm2_id} --update-env`)	
})



app.use(express.static("public"))




app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/404.html')
})

http.listen(port, () => {
	log(`AirBorne er åben på port: ${ port }! Wuhuuu!`)
})

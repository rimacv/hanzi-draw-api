var express = require('express')
var fs = require('fs')
var http = require('http')
var app = express()
var bodyParser = require('body-parser')
var path = require('path');

var fs = require('fs');
var data = JSON.parse(fs.readFileSync(path.join(__dirname, "dict-minified.json") , 'utf8'));

port = 10000
textParser = bodyParser.text({ type: 'text/html' })

app.use(bodyParser.json({ type: 'application/json' }))

// POST /login gets urlencoded bodies
app.post('/api/imagename', textParser, function (req, res) {
  res.send('welcome, ' + data[req.body.hanzi].fileName)
})


http.createServer(app)
.listen(port, function () {
  console.log(`Example app listening on port ${port}! Go to http://localhost:${port}/`)
})

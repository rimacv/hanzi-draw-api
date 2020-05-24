var express = require('express')
var fs = require('fs')
var http = require('http')
var app = express()
var bodyParser = require('body-parser')
var path = require('path');

var fs = require('fs');
var data = JSON.parse(fs.readFileSync(path.join(__dirname, "dict-minified.json") , 'utf8'));

const port = 10000
const textParser = bodyParser.text({ type: 'text/html' })

app.use(bodyParser.json({ type: 'application/json' }))

const versionHandler = function (req, res, next) {
  if (req !== null )
  {
    if(req.hasOwnProperty('body') && req.body !== null)
    {
      if(req.headers.hasOwnProperty('app-version'))
      {
        next()
      }
      else{
        let status = 400
        res.status(status).send(http.STATUS_CODES[status])
      }
    }
  }

}

app.use(versionHandler)

app.post('/api/imagename', textParser, function (req, res) {
  if (req.body.hasOwnProperty('hanzi') && req.body.hanzi !== null)
  {
      let hanzi = req.body.hanzi
      if(data.hasOwnProperty(hanzi))
      {
        if(data[hanzi].hasOwnProperty('fileName') && data[hanzi].fileName !== null){

          res.send(JSON.stringify({"fileName" : data[hanzi].fileName}))
          return
        }
      }
  }
  res.send(JSON.stringify({"fileName": "Not Found"}) )
})

app.get('/api/adfrequence',  function (req, res) {
    res.send(JSON.stringify({"frequence": 12}))
})


http.createServer(app)
.listen(port, function () {
  console.log(`api is running on port ${port}! Go to http://localhost:${port}/`)
})

var express = require('express')
var fs = require('fs')
var http = require('http')
var app = express()
var bodyParser = require('body-parser')
var path = require('path');

var fs = require('fs');
const data_eng = JSON.parse(fs.readFileSync(path.join(__dirname, "dict-minified.json") , 'utf8'));
const data_ger = JSON.parse(fs.readFileSync(path.join(__dirname, "dict-minified-ger.json") , 'utf8'));
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
      if(data_eng.hasOwnProperty(hanzi))
      {
        if(data_eng[hanzi].hasOwnProperty('fileName') && data_eng[hanzi].fileName !== null){

          res.send(JSON.stringify({"fileName" : data_eng[hanzi].fileName}))
          return
        }
      }
  }
  res.send(JSON.stringify({"fileName": "Not Found"}) )
})

app.get('/api/adfrequence',  function (req, res) {
    res.send(JSON.stringify({"frequence": 12}))
})

function isDataAvailableForHanzi(hanzi, data){
  if(data.hasOwnProperty(hanzi))
  {
    if(data[hanzi].hasOwnProperty('definition') && data[hanzi].definition !== null ){
      if(data[hanzi].hasOwnProperty('pinyin') && data[hanzi].pinyin !== null ){
        return true
      }
    }
  }
  return false
}

function sendHanziData(hanzi,data, res){
  const hanziData = {"definition" : data[hanzi].definition, "pinyin":data[hanzi].pinyin }
  res.send(JSON.stringify(hanziData))
}

function getPreferedLanguage(req){
  if(req.headers.hasOwnProperty('accept-language'))
  {
    return req.headers["accept-language"]
  }
  else{
    return "eng"
  }
}


app.post('/api/info',  function (req, res) {
  if (req.body.hasOwnProperty('hanzi') && req.body.hanzi !== null)
  {
      let hanzi = req.body.hanzi
      let preferedLanguageData = data_eng
      if(getPreferedLanguage(req) === "deu"){
        preferedLanguageData = data_ger
      }

      if(isDataAvailableForHanzi(hanzi,preferedLanguageData)){
        sendHanziData(hanzi,preferedLanguageData, res)
        return
      }

  }

  res.send(JSON.stringify({"definition": "Not Found", "pinyin" : "Not Found" }) )
})


http.createServer(app)
.listen(port, function () {
  console.log(`api is running on port ${port}! Go to http://localhost:${port}/`)
})

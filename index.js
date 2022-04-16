const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const api_router = require('./routes/api');


require('dotenv').config()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use('/api',api_router);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('RESTful API server started on: ' + port)
module.export = app;
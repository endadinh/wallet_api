const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')
// const swaggerDocument = require('./swagger.json');
const api_router = require('./routes/api');


require('dotenv').config()


const port = process.env.PORT || 3000;


const options = { 
    definition: { 
        openapi: "3.0.0",
        info: { 
            title: "Library API",
            version: "1.0.0",
            description: "A Wallet API on BSC Network",

        },
        servers: [
            { 
                url: "http://localhost:3000",

            }
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);


const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/wallet', api_router);


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('RESTful API server started on: ' + port)
module.exports = app;
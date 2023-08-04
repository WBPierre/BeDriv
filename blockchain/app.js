require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');
const config = require('./config/server');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
routes(app);

app.listen(config.server.port, config.server.hostname);

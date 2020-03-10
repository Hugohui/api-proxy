const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Auth = require('./common/auth')
const settings = require('./settings')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(Auth)

app.use('/', require('./router/router'));

let server = app.listen(settings.serverPort, () =>{
    console.log(`started the server,the port is ${settings.serverPort}`);
});

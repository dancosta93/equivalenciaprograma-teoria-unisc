/**
 * Created by User on 5/31/2016.
 */
var express = require('express');
var bodyParser = require('body-parser'); //parametros para o POST
var _ = require('lodash');
var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.listen(8080);
console.log("App listening on port 8080");



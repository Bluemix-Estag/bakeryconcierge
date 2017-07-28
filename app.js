/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    fs = require('fs'),
    request = require('request'),
    xhr = require('xhr');

// I call it a Frame but you can go with i.E. CanvasConverter, whatever 
var Frame  = require('canvas-to-buffer')
 



var app = express();

var db;

var cloudant;

var fileToUpload;



var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));


app.get('/', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    res.render('index.html');
})

app.post('/convertcanvas',multipartMiddleware,function(req,res){

console.log(req);
// var canvas = req.body.canvas;


// // Drop in any canvas, i.E. from a webcam 
// var frame  = new Frame(canvas)
 
// // Automatically detects image type and does the conversion 
// var buffer = frame.toBuffer()


// console.log(buffer);
})




http.createServer(app).listen(app.get('port'), '0.0.0.0', function () {
    console.log('Express server listening on port ' + app.get('port'));
});
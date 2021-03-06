// Comment
// Otro comentario para probar el Webhook
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var app = express();
var fs = require('fs');

var mongoHost = process.env.MONGO_SERVICE_HOST;
var mongoPort = process.env.MONGO_SERVICE_PORT || '27017';
var mongoUser = process.env.MONGO_USER;
var mongoPass = process.env.MONGO_PASS;
var mongoDB = process.env.MONGO_DB;
var parseURL = process.env.PARSE_URL;

var mongoConnString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort + '/' + mongoDB;

var dashboard = new ParseDashboard({
    "allowInsecureHTTP": true,
	"apps": [
		{
			"serverURL": parseURL,
			"appId": "myAppId",
			"masterKey": "myMasterKey",
			"appName": "ZBoxTest"
		}
	],
	"users": [
    {
      "user":"zbox",
      "pass":"zbox"
    }]
}, true);

var api = new ParseServer({
  databaseURI: mongoConnString, // Connection string for your MongoDB database
  cloud: '/opt/app-root/src/cloud/main.js', // Absolute path to your Cloud Code
  appId: 'myAppId',
  masterKey: 'myMasterKey', // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: parseURL // Don't forget to change to https if needed
});

// make the Parse Server available at /parse
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

app.use('/hola', function(req, res){
	res.send("Hola Mundo con Push");
})

var httpServer = require('http').createServer(app);
httpServer.listen(8080);

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var app = express();
var fs = require('fs');

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoDB = process.env.MONGO_DB;

var mongoConnString = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDB;

var dashboard = new ParseDashboard({
	"apps": [
		{
			"serverURL": "http://localhost:4040/parse",
			"appId": "myAppId",
			"masterKey": "myMasterKey",
			"appName": "ZBoxTest"
		}
	]
});

var api = new ParseServer({
  databaseURI: mongoConnString, // Connection string for your MongoDB database
  cloud: './cloud/main.js', // Absolute path to your Cloud Code
  appId: 'myAppId',
  masterKey: 'myMasterKey', // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: 'http://localhost:4040/parse' // Don't forget to change to https if needed
});

// make the Parse Server available at /parse
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

var httpServer = require('http').createServer(app);
httpServer.listen(4040);
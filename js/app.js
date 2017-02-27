var sql = require('sql.js');
var fs = require('fs');
var filebuffer = fs.readFileSync('databasesElectiondatabase.db');

var db = new sql.Database(filebuffer);

//File Operation and Directory Creation
var userProfile = process.env.USERPROFILE;
var filePath = userProfile + '\\sevakData\\dataDump.json';

if (!fs.existsSync(userProfile + '\\sevakData')) {
	fs.mkdirSync(userProfile + '\\sevakData')
}

var writeDataIntoFile = function(data) {
	var JSONData = angular.toJson(data, true);
	fs.writeFileSync(filePath, JSONData);
}

var appendDataToFile = function(data) {
	var JSONData = angular.toJson(data, true);
	fs.appendFile(filePath, JSONData);
}

console.log(userProfile);

var app = angular.module('sevak', [ 'ngRoute' ]);

//Angular Routing
app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl : "views/home.html",
		controller : "sevakController"
	}).when("/main2", {
		templateUrl : "views/main2.html",
		controller : "sevakController"
	});
});

app.service('databaseService', function() {

	var databaseService = {}

	databaseService.getAllData = function(cb) {

		var contents = db.exec("SELECT * FROM VoterList");
		if (cb) {
			cb(formatData(contents));
		}
	}

	databaseService.queryOnCondition = function(queryCondition, cb) {

		var contents = db.exec("Select * from VoterList WHERE "
				+ queryCondition);

		if (cb) {
			cb(formatData(contents));
		}
	}
	
	//Format raw data into Json Object Array
	var formatData = function(data) {
		var resultArray = []
		for (var i = 0; i < data[0].values.length; i++) {
			var temp = {};
			for (var j = 0; j < data[0].columns.length; j++) {
				var tempColumn = data[0].columns[j];
				//tempColumn=trim(tempColumn);
				temp[tempColumn] = data[0].values[i][j];
			}
			resultArray.push(temp);

		}

		return resultArray;
	}

	return databaseService;

});

app.controller('sevakController', function($scope, $http, databaseService) {
	
	
	//Fetch Data from .db file
	databaseService.getAllData(function(result) {
		console.log(result);
		$scope.VoterListData = result;
	});
	
	//Example query on conditional search
	databaseService.queryOnCondition('SectionNo=17', function(result) {
		console.log(result);

	});
	
	var VoterDataKeys=Object.keys($scope.VoterListData[0]);
	
	//Declare Search Object 
	$scope.search={};
	
	for(var i=0; i<VoterDataKeys.length; i++)
		{
			$scope.search[VoterDataKeys[i]]='';
		}
	
	console.log($scope.search);
	
	//Write the VoterData to Local Json
	writeDataIntoFile($scope.VoterListData);

	console.log("Fetching from file");

	$http.get(filePath).then(function(result) {

		console.log("Fetching Completed");
		$scope.VoterListData = result.data;

	});

});

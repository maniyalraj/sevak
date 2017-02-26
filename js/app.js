var sql = require('sql.js');
var fs = require('fs');
var filebuffer = fs.readFileSync('databasesElectiondatabase.db');

var db = new sql.Database(filebuffer);

var userProfile = process.env.USERPROFILE;
if (!fs.existsSync(userProfile + '\\sevakData')) {
	fs.mkdirSync(userProfile + '\\sevakData')
}
var filePath = userProfile + '\\sevakData\\dataDump.json';
var writeDataIntoFile = function(data) {
	var JSONData = angular.toJson(data);
	fs.writeFileSync(filePath, JSONData);
}

var appendDataToFile = function(data) {
	var JSONData = angular.toJson(data);
	fs.appendFile(filePath, JSONData);
}

console.log(userProfile);

var app = angular.module('sevak', [ 'ngRoute' ]);

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

})
app.controller('sevakController', function($scope, $http, databaseService) {

	databaseService.getAllData(function(result) {
		console.log(result);
		$scope.VoterListData = result.data;
	});

	databaseService.queryOnCondition('SectionNo=17', function(result) {
		console.log(result);

	});

	$scope.search = {
		ConstNo : '',
		PartNo : '',
		SrNoInPart : '',
		HouseNo : '',
		FullName : '',
		FullName_Unicode : '',
		SectionNo : '',
		Age : '',
		Sex : '',
		PhoneNo : '',
		EmailId : '',
		Voted : '',
		ColourNo : '',
		SurNameID : '',
		DubarQty : '',
		CastID : '',
		Status : '',
		UniqueVoterID : '',
		CardNo : '',
		OnlineUPDateStatus : '',
		IMPVoter : ''

	};

	writeDataIntoFile($scope.VoterListData);

	console.log("Fetching from file");

	$http.get(filePath).then(function(result) {

		console.log("Fetching Completed");
		$scope.VoterListData = result.data;

	});

})

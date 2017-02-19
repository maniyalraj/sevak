var sql = require('sql.js');
var fs= require('fs');
var filebuffer = fs.readFileSync('databasesElectiondatabase.db');

var db = new sql.Database(filebuffer);



var contents = db.exec("SELECT * FROM VoterList");

var app=angular.module('sevak',['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/home.html",
        controller: "sevakController"
    })
    .when("/main2", {
        templateUrl : "views/main2.html",
        controller: "sevakController"
    });
});

app.controller('sevakController',function($scope){
	$scope.VoterListColumns=contents[0].columns;
	$scope.VoterListValues=contents[0].values;
	$scope.VoterListData=[];
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
	for(var i=0; i<$scope.VoterListValues.length; i++)
		{
			var temp={};
			for(var j=0;j<$scope.VoterListColumns.length; j++)
				{	
					var tempColumn= $scope.VoterListColumns[j];
					//tempColumn=trim(tempColumn);
					temp[tempColumn]=$scope.VoterListValues[i][j];
				}
			$scope.VoterListData.push(temp);
		
		}
	
})

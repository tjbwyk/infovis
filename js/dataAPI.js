// JavaScript Document

// Declare variable to save data in	
var myjson;
	
// Loading in JSON file	
$.ajax({
  url: 'data/crimeDict.json',
  async: false,
  dataType: 'json',
  success: function (json) {
  
	// Save data to myjson variable
    myjson = json;
  }
});

var TCrimes;
// Loading in JSON file	
$.ajax({
  url: 'data/total.json',
  async: false,
  dataType: 'json',
  success: function (json) {
	  
  //console.log(json + "end");
	// Save data to TCrimes variable
    TCrimes = json;
  }
});

var areaSet;
// Loading in JSON file	
$.ajax({
  url: 'data/uk_police_force_areas.topojson',
  async: false,
  dataType: 'json',
  success: function (uk) {
	  
  //console.log(json + "end");
	// Save data to TCrimes variable
    areaSet = topojson.feature(uk, uk.objects.uk_police_force_areas);
  }
});

// Function to get population number of district
function get_population(distID)
{
	var population = myjson[distID]['population']
	return population;
}

// Function to get name of district
function get_name(distID)
{
	var distName = myjson[distID]['name']
	return distName;
}

// Function to get total crimes in a month in one district
function get_total(distID,year,month)
{
	var total = myjson[distID]['crimes'][year.toString()][month.toString()]['total'];
	//console.log(total);
	return total;
}

// Function to get total crimes in a month in one district
function get_crimes(distID,typeID,year,month)
{
	//console.log("myjson " + myjson + "typeID" + typeID);
	var crimes = myjson[distID]['crimes'][year.toString()][month.toString()]['perType'][typeID];
	return crimes;
}

// Function to get number of police officers in district
function get_officers(distID)
{
	var officers = myjson[distID]['officers'];
	return officers;
}

//Funtion to get total crime number of more than one district in whole time period
function get_dists_all(distIDs)
{
	var totalCrimes = 0;
	for (var num in distIDs){
	for (i = 2011; i < 2014; i++){
		for (j = 1; j < 13; j++){
			totalCrimes += get_total(distIDs[num],i,j);
			}
		}
	totalCrimes += get_total(distIDs[num], 2010, 12);
//	console.log("get_dists_all" + totalCrimes);
	}
	return totalCrimes;
}

//Funtion to get total crime number
function get_dataNew_all()
{
	var totalCrimes = 0;
	for (var num in dataNew){
	for (i = 0; i < 37; i++){
			totalCrimes += dataNew[i].crimes;
		}
	}
	return totalCrimes;
}

function checkbox(){

var str = document.getElementsByName("CrimeType");

for (var i =0; i < 16; i ++){
		if(str[i].checked === true){
		
		typeID[i] = 1;
		j++;
		}else{
		typeID[i] = 0;
		}
	}
console.log(typeID);
calTypes(typeID);
}

//calculate by crime types and update map & timeline bar & total crime numbers
function calTypes(typeID){
	var crimenumbers, temp = 0;
	var type = [];
	
	for (var i in typeID){
		if (typeID[i] === 1){
			type.push(parseInt(i)+1);
		}
	}
	console.log(type);
	
	//if user doesn't select any district and all crime types as default
	if(id.length === 0 & type.length === 0){
		crimenumbers = 18934559;
	}else if (id.length === 0 & type.length !=0 ){
	//all districts but part of crime types
		id = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45];
		addTimeline(TCrimes, id, typeID);
		crimenumbers = get_dataNew_all();
	}else{
	//part dirstricts and part of crime types
		
	}
	
	displayCrimenumbers(crimenumbers);
	console.log(crimenumbers);
}

/*
/// Examples calling the functions:

	// Get population of district 2
	var population =  get_population(2);

	// Get name of district 2
	var distName =  get_name(2);

	// Get total crime number of district 2 in 2011-01
	var total = get_total(2,2011,1)

	// Get number of crime from type 1 in district 2 in 2011-01
	var crimes = get_crimes(2,1,2011,1)

	// Get number of police officers in district 2
	var officers = get_officers(2)


// Printing everything in console:
console.log("The name of the district is : " + distName);
console.log("The population is: " + population);
console.log("The total number of crimes: " + total);
console.log("The total number of crimeType 1: " + crimes);
console.log("The total number of officers: " + officers);
*/
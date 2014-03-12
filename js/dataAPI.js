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

// Function to get population number of district
function get_population(distID)
{
	var population = myjson[distID.toString()]['population']
	return population;
}

// Function to get name of district
function get_name(distID)
{
	var distName = myjson[distID.toString()]['name']
	return distName;
}

// Function to get total crimes in a month in one district
function get_total(distID,year,month)
{
	var total = myjson[distID.toString()]['crimes'][year.toString()][month.toString()]['total']
	return total;
}

// Function to get total crimes in a month in one district
function get_crimes(distID,typeID,year,month)
{
	var crimes = myjson[distID.toString()]['crimes'][year.toString()][month.toString()]['perType'][typeID.toString()];
	return crimes;
}

// Function to get number of police officers in district
function get_officers(distID)
{
	var officers = myjson[distID.toString()]['officers'];
	return officers;
}

//Funtion to get total crime number of more than one district in whole year
function get_dists_year(distIDs, year)
{
	
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
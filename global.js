var MAXN = 50;

var mapSel = Array(MAXN);
var id = Array();

for (var i = 0; i < MAXN; i++)
	mapSel[i] = false;

// Function to get the selected districts, return value is an array of IDs
function get_selected_distIDs() {
	distIDs = new Array();
	for (var i = 0; i < MAXN; i++) {
		if (mapSel[i]) {
			distIDs.push(i);
		}
	}
	return distIDs;
}

// Declare variable to save data in	
var myjson;
	
// Loading in JSON file	
$.ajax({
  url: 'crimeDict.json',
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
  url: 'total.json',
  async: false,
  dataType: 'json',
  success: function (json) {
	  
  console.log(json + "end");
	// Save data to TCrimes variable
    TCrimes = json;
  }
});

console.log(TCrimes);

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

//Funtion to get total crimes in all district in one month
function get_total_crimes(year, month)
{
	var totalCrime = [514642, 514330, 577984, 606573, 587937, 579194, 616523, 601347, 546062, 578517, 530472, 479808, 492535, 479179, 556825, 490100, 538746, 513119, 548430, 559429, 502359, 520269, 483102, 442047, 472529, 431382, 462274, 471476, 487366, 500337, 560263, 533991, 469689, 468153, 458449, 428844];
	if (year === 2011){
		if (month<13){
			return totalCrime[month-1];	
		}else{
			return null;	//error 
		}
	}else if (year === 2012){
		if (month<13){
			return totalCrime[month + 11];	
		}else{
			return null;	
		}
	}else{
		return totalCrime[month + 23];	
	}
	
}


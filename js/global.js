var padding = 50; //Padding between the visualization and the border of the SVG canvas
var barPadding = 10; //Padding between bars

var MAXINT = 2147483647;
var MAXN = 50;

var dataTemp = {};
var dataNew = [];
var typeID = [];	//0 or 1
var Crimetype = [];	// transfer typeID to types
var crimes_perType_perDist = []; 
var TotalCrimeNumbers = 18934559;
var date;

var bYear = 2010,
	bMonth = 12,
	eYear = 2013,
	eMonth = 12;

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

function get_selected_crimeIDs() {
	var str = document.getElementsByName("CrimeType");
	typeID = [];
	for (var i =0; i < 16; i ++){
		if(str[i].checked === true) {
			typeID.push(i + 1);
		}
	}
	return typeID;
}

function cal_crimes_perDist(dist){
	var num = 0;
	var crimes = [];
	//all types
	if (Crimetype.length === 0 || Crimetype.length === 16){
		for (var i in dist){
				
		num += get_total(dist[i], 2010, 12);
		
		}
		dataNew[0] = new creatJSON(new Date(2010, 12), 12, num);
		
		var index = 1;
		for (year = 2011; year < 2014; year++){
				for (month = 1; month < 13; month ++){
				date = new Date(year, month);
				num = 0;
				for (var i in dist){
				num += get_total(dist[i], year, month);
				}
				dataNew[index] = new creatJSON(date, month, num);
				index++;
			}
		}
	}else{
	//calculate crime types & districts crimes whole time period
	
		TotalCrimeNumbers = 0;
		
		dataNew[0] = get_crimes_perType_perDist(dist,Crimetype, 2010, 12 );
		
		TotalCrimeNumbers += dataNew[0].crimes;
		
		console.log(Crimetype);
		
		var index = 1;
		for (year = 2011; year < 2014; year++){
				for (month = 1; month < 13; month ++){
				date = new Date(year, month);
				dataNew[index] = get_crimes_perType_perDist(dist,Crimetype, year, month);
				TotalCrimeNumbers += dataNew[index].crimes;
				index++;
			}
		}
			
	}
	
	//console.log("Crimetype: " + Crimetype + "totalcrimenumbers: " + TotalCrimeNumbers + "dataNew： ");
	//console.log(dataNew);
}

function creatJSON(date,month, crimes){
	var newObject = {
    date: date,
	month: month,
    crimes: crimes
        }
    return newObject;
}

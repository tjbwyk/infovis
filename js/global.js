var padding = 50; //Padding between the visualization and the border of the SVG canvas
var barPadding = 10; //Padding between bars

var MAXN = 50;

var dataTemp = {};
var dataNew = [];
var num;
var date;

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

function cal_crimes_perDist(){
	var i = 1;
	num = get_total(id[0], 2010, 12);
	dataNew[0] = new creatJSON(new Date(2010, 12), 12, num);
	
	for (year = 2011; year < 2014; year++){
			for (month = 1; month < 13; month ++){
			date = new Date(year, month);
			num = get_total(id[0], year, month);
			dataNew[i] = new creatJSON(date, month, num);
			i++;
		}
	}
	
	console.log(dataNew);
}

function creatJSON(date,month, crimes){
	var newObject = {
    date: date,
	month: month,
    crimes: crimes
        }
    return newObject;
}
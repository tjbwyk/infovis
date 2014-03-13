var padding = 50; //Padding between the visualization and the border of the SVG canvas
var barPadding = 10; //Padding between bars

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

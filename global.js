
var MAXN = 50;

var mapSel = Array(MAXN);
for (var i = 0; i < MAXN; i++)
	mapSel[i] = false;

console.log("begin");
console.log(mapSel);
// Function to get the selected districts, return value is an array of IDs
function get_selected_distIDs() {
	distIDs = new Array();
	for (var i = 0; i < MAXN; i++) {
		if (mapSel[i]) {
			distIDs.push(i);
		}
	}
	console.log(mapSel);
	console.log("end");
	return distIDs;
}

var id = get_selected_distIDs();

console.log(id);
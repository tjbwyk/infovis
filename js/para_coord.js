// JavaScript Document

var MAXC = 16;

var paraCoord;

var colorgen = d3.scale.category20();

function initParaCoord() {
}

function updateParaCoord(distIDs, beginYear, beginMonth, endYear, endMonth) {
	
	d3.select("#para_coord").selectAll("*").remove();
	
	var data = [];
	if (distIDs.length == 0) {
		 distIDs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45];
	}
	for (var crimeType = 2; crimeType <= 16; crimeType++) {
		data.push(new Array());
		//console.log(data);
		for (var i = 0; i < distIDs.length; i++) {
			distID = distIDs[i];
			//console.log(distID);
			var total = 0;
			for (var yy = beginYear, mm = beginMonth; !((yy > endYear) || (yy == endYear && mm > endMonth)); mm++) {
				if (mm > 12) {
					yy++;
					mm = 1;
				}
				var temp;
				try {
					temp = get_crimes(distID, crimeType, yy, mm);
					total += temp;
				} catch(e) {
				}
			}
			var population;
			try {
				population = get_population(distID);
				data[crimeType - 2].push(total / get_population(distID));
			} catch(e) {
				//console.log([distID,e]);
			}
		}
	}
	
	//console.log(data);
	var i = 0;
	paraCoord = d3.parcoords()("#para_coord")
		.data(data)
		.color(function(d) {
			return colorgen(i++);
		})
		.render()
		.brushable()
		.interactive();
}

updateParaCoord([], 2010, 12, 2013, 12);

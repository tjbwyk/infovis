// JavaScript Document

var MAXC = 16;

var paraCoord;

var colorgen = d3.scale.category20();

function prepareData(diatIDs, typeIDs, beginYear, beginMonth, endYear, endMonth) {
	var data=[];
	if (typeIDs.length === 0) {
		typeIDs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
	}
	for (var iType in typeIDs) {
		crimeType = typeIDs[iType];
		data.push(new Array());
		//console.log(data);
		data[iType].push(get_crimes_perType_perDist_monthRange([], [crimeType], beginYear, beginMonth, endYear, endMonth) / get_uk_population());
		for (var iDist in distIDs) {
			distID = distIDs[iDist];
			//console.log(distID);
			var total = get_crimes_perType_perDist_monthRange([distID], [crimeType], beginYear, beginMonth, endYear, endMonth);
			var population;
			try {
				population = get_population(distID);
				data[iType].push(total / get_population(distID));
			} catch(e) {
				//console.log([distID,e]);
			}
		}
	}
	return data;
}

function initParaCoord() {
}

function updateParaCoord(distIDs, typeIDs, beginYear, beginMonth, endYear, endMonth) {
	//console.log(distIDs);
	//console.log(typeIDs);
	d3.select("#para_coord").selectAll("*").remove();
	
	var data = prepareData(distIDs, typeIDs, beginYear, beginMonth, endYear, endMonth);
	
	console.log(data);
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

updateParaCoord([], [], 2010, 12, 2013, 12);

// JavaScript Document

var nameList = ["Avon and Somerset", "Bedfordshire", "Cambridgeshire", "Cheshire", "City of London", "Cleveland", "Cumbria", "Derbyshire", "Devon and Cornwall", "Dorset", "Durham", "Essex", "Gloucestershire", "Greater Manchester", "Hampshire", "Hertfordshire", "Humberside", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Metropolitan", "Norfolk", "Northamptonshire", "Northumbria", "North Yorkshire", "Nottinghamshire", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Sussex", "Thames Valley", "Warwickshire", "West Mercia", "West Midlands", "West Yorkshire", "Wiltshire", "Dyfed-Powys", "Gwent", "North Wales", "South Wales", "Scotland", "Northern Ireland"];

var fakeRatio = new Array(MAXN);
for (var i = 0; i < MAXN; i++) {
	fakeRatio[i] = Math.random();
}
var fakeColor0 = new Array(MAXN);
var fakeColor1 = new Array(MAXN);
for (var i = 0; i < MAXN; i++) {
	fakeColor0[i] = [0, 0, 0];
	fakeColor1[i] = [0, 0, 0];
}

var widthM = 350,
	heightM = 400;

var mapTip = d3.tip()
	.attr("id", "map")
	.attr("class", "d3-tip")
	.html(function(d) {
		return nameList[d.id - 1];
	});

var svgMap = d3.select("#map")
			.append("svg")
			.attr("width", widthM)
			.attr("height", heightM)
			.call(mapTip);

d3.json("data/uk_police_force_areas.topojson", function(error, uk) {
	areaSet = topojson.feature(uk, uk.objects.uk_police_force_areas);
	
	var projection = d3.geo.albers()
						   .center([1.5, 53.5])
						   .rotate([4.4, 0])
						   .parallels([50, 60])
						   .scale(3000)
						   .translate([widthM / 2, heightM / 2]);
	var path = d3.geo.path()
					 .projection(projection);
	svgMap.selectAll(".uk_police_force_areas")
		.data(areaSet.features)
		.enter()	
		.append("path")
		.attr("d", path)
		.attr("visibility", "hidden")
		.attr("class", function(d) {
			if (d.id == 44)
				return "map_scotland";
			else
				return "map_unselect_normal";
		})
		.attr("id", function(d) {
			return d.id;
		})
		.attr("title", function(d) {
			return nameList[d.id - 1];
		})
		.on("mouseover", function(d) {
			//console.log(this);
			if (d.id == 44)
				return;
			var mapclass;
			if (mapSel[d.id]) {
				mapclass = "map_select_hover";
			} else {
				mapclass = "map_unselect_hover";
			}
			d3.select(this)
				.attr("class", mapclass);
		})
		.on("mouseout", function(d) {
			//d3.select("#tooltip").classed("hidden", true);
			mapTip.hide(d);
			if (d.id == 44)
				return;
			var mapclass;
			if (mapSel[d.id]) {
				mapclass = "map_select_normal";
			} else {
				mapclass = "map_unselect_normal";
			}
			d3.select(this)
				.attr("class", mapclass);
		})
		.on("mousedown", function(d) {
			if (d.id == 44)
				return;
			var k = d.id;
			var mapclass;
			if (mapSel[d.id]) {
				mapclass = "map_unselect_hover";
				mapSel[d.id] = false;
				d3.select(this).attr("fill", "rgb(" + fakeColor0[k][0] + "," + fakeColor0[k][1] + "," + fakeColor0[k][2] + ")");
			} else {
				mapclass = "map_select_hover";
				mapSel[d.id] = true;
				d3.select(this).attr("fill", "rgb(" + fakeColor1[k][0] + "," + fakeColor1[k][1] + "," + fakeColor1[k][2] + ")");
			}
			d3.select(this)
			.attr("class", mapclass);
			
			//achieve district ID and update timeline data
			id = get_selected_distIDs();
			//console.log("map's id:" + id);
			addTimeline(TCrimes, id);
		})
		.on("mousemove", function(d) {
			var mousePos = d3.mouse(this);
//			d3.select("#tooltip")
//				.style("left", mousePos[0] + "px")
//				.style("top", mousePos[1] + 30 + "px")
//				.text(nameList[d.id - 1])
//				.style("font-family", "Helvetica, Arial, sans-serif,Gotham");
//			d3.select("#tooltip").classed("hidden", false);
			mapTip.show(d);
		});

	updateMap(2012, 12, 2013, 12);
});

function updateMap(beginYear, beginMonth, endYear, endMonth) {
	var crimeRate = new Array(MAXN);
	for (var dist = 0; dist < MAXN; dist++)
		crimeRate[dist] = 0;
	for (var yy = beginYear, mm = beginMonth; !((yy > endYear) || (yy == endYear && mm > endMonth)); mm++) {
		if (mm > 12) {
			yy++;
			mm = 1;
		}
		for (var dist = 1; dist <= 45; dist++) {
			var total;
			try {
				//console.log([yy, mm, dist, total, crimeRate[dist]]);
				total = get_total(dist, yy, mm);
				crimeRate[dist] += total;
				//console.log([yy, mm, dist, total, crimeRate[dist]]);
			} catch(e) {
				console.log(e);
			}
			//console.log(dist);
		}
	}
	for (var dist = 1; dist <= 45; dist++) {
		var population;
		try {
			population = get_population(dist);
			crimeRate[dist] /= population;
		} catch(e) {
			console.log(e);
		}
		//console.log(dist);
	}
	
	var minTotal = MAXINT,
		maxTotal = -MAXINT;
	for (var dist = 1; dist <= 45; dist++) {
		if (dist != 44) {
			minTotal = Math.min(minTotal, crimeRate[dist]);
			maxTotal = Math.max(maxTotal, crimeRate[dist]);
		}
	}
	
	var colorRate = new Array(MAXN);
	for (var dist = 1; dist <= 45; dist++) {
		if (dist != 44) {
			colorRate[dist] = (crimeRate[dist] - minTotal) / (maxTotal - minTotal);
		} else {
			colorRate[dist] = -1;
		}
		fakeColor0[dist] = [102 - Math.round(91 * colorRate[dist]), 163 - Math.round(66 * colorRate[dist]), 210 - Math.round(46 * colorRate[dist])];
		fakeColor1[dist] = [255, 195 - Math.round(49 * colorRate[dist]), 115 - Math.round(115 * colorRate[dist])];
	}
	
	console.log(colorRate);
	svgMap.selectAll("path")
		.data(areaSet.features)
		.attr("value", function(d) {
			return colorRate[d.id];
		})
		.attr("visibility", "display")
		.attr("fill", function(d) {
			var k = d.id;
			if (!mapSel[d.id]) {
				return "rgb(" + fakeColor0[k][0] + "," + fakeColor0[k][1] + "," + fakeColor0[k][2] + ")";
			} else {
				return "rgb(" + fakeColor1[k][0] + "," + fakeColor1[k][1] + "," + fakeColor1[k][2] + ")";
			}
		})
}

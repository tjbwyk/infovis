// JavaScript Document

var MAXN = 50;
var nameList = ["Avon and Somerset", "Bedfordshire", "Cambridgeshire", "Cheshire", "City of London", "Cleveland", "Cumbria", "Derbyshire", "Devon and Cornwall", "Dorset", "Durham", "Essex", "Gloucestershire", "Greater Manchester", "Hampshire", "Hertfordshire", "Humberside", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Metropolitan", "Norfolk", "Northamptonshire", "Northumbria", "North Yorkshire", "Nottinghamshire", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Sussex", "Thames Valley", "Warwickshire", "West Mercia", "West Midlands", "West Yorkshire", "Wiltshire", "Dyfed-Powys", "Gwent", "North Wales", "South Wales", "Scotland", "Northern Ireland"];

var width = 400;
var height = 600;
var mapSel = Array(MAXN);
for (var i = 0; i < MAXN; i++)
	mapSel[i] = false;
var svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
			
d3.json("uk_police_force_areas.topojson", function(error, uk) {
	areaSet = topojson.feature(uk, uk.objects.uk_police_force_areas);
	
	var projection = d3.geo.albers()
						   .center([0, 55.4])
						   .rotate([4.4, 0])
						   .parallels([50, 60])
						   .scale(3000)
						   .translate([width / 2, height / 2]);
	var path = d3.geo.path()
					 .projection(projection);
	svg.selectAll(".uk_police_force_areas")
		.data(areaSet.features)
		.enter()	
		.append("path")
		.attr("d", path)
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
			d3.select("#tooltip").classed("hidden", true);
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
			var mapclass;
			if (mapSel[d.id]) {
				mapclass = "map_unselect_hover";
				mapSel[d.id] = false;
			} else {
				mapclass = "map_select_hover";
				mapSel[d.id] = true;
			}
			d3.select(this)
				.attr("class", mapclass);
		})
		.on("mousemove", function(d) {
			var mousePos = d3.mouse(this);
			console.log(mousePos);
			d3.select("#tooltip")
				.style("left", mousePos[0] + "px")
				.style("top", mousePos[1] - 35 + "px")
				.text(nameList[d.id - 1]);
			d3.select("#tooltip").classed("hidden", false);
		});
});
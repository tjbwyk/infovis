// JavaScript Document
var colorNormal = "#006fff";
var colorNormalHighLight = "#4d9aff";
var colorSelect = "#FF9000";
var colorSelectHighLight = "#ffb14d";
var width = 480;
var height = 540;
var mapSel = Array(60);
for (var i = 0; i < 60; i++)
	mapSel[i] = false;
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
			
d3.json("uk_police_force_areas.topojson", function(error, uk) {
	areaSet = topojson.feature(uk, uk.objects.uk_police_force_areas);
	
	var projection = d3.geo.albers()
						   .center([0, 55.4])
						   .rotate([4.4, 0])
						   .parallels([50, 60])
						   .scale(2600)
						   .translate([width / 2, height / 2]);
	var path = d3.geo.path()
					 .projection(projection);
	svg.selectAll(".uk_police_force_areas")
		.data(areaSet.features)
		.enter()	
		.append("path")
		.attr("d", path)
		.attr("class", "map_unselect_normal")
		.attr("id", function(d) {
			return d.id;
		})
		.on("mouseover", function(d) {
			//console.log(this);
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
		});
});
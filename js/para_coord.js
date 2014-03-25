// JavaScript Document

var MAXC = 16;

var paraCoord;

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

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	  extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
	return actives.every(function(p, i) {
	  return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	}) ? null : "none";
  });
}

function initParaCoord() {
}

function updateParaCoord(distIDs, typeIDs, beginYear, beginMonth, endYear, endMonth) {
	//console.log(distIDs);
	//console.log(typeIDs);
	
	function position(d) {
	  var v = dragging[d];
	  return v == null ? x(d) : v;
	}
	
	function transition(g) {
	  return g.transition().duration(500);
	}
	
	// Returns the path for a given data point.
	function path(d) {
		var pp = [];
		for (var i in dimensions) {
			pp.push([position(dimensions[i]), y(d[i])]);
		}
		//console.log(pp);
		return line(pp);
	}
	
	d3.select("#para_coord").selectAll("*").remove();
	
	var canvas = document.getElementById("para_coord");
	
	var m = [30, 10, 10, 10],
		w = canvas.offsetWidth - m[1] - m[3],
		h = canvas.offsetHeight - m[0] - m[2];
	
	var x = d3.scale.ordinal().rangePoints([0, w], 1),
		y,
		dragging = {};
	
	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		background,
		foreground;
		
	var svg = d3.select("#para_coord").append("svg")
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2])
		.append("g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	
	var data = prepareData(distIDs, typeIDs, beginYear, beginMonth, endYear, endMonth);
	
	var minV = MAXINT,
		maxV = -MAXINT;
	for (var i = 0; i < data.length; i++) {
		minV = Math.min(minV, d3.min(data[i]));
		maxV = Math.max(maxV, d3.max(data[i]));
	}
	y = d3.scale.linear()
			    .domain([minV, maxV])
			    .range([h, 0]);
	
	//console.log([minV, maxV]);
	
	dimensions = ["UK"];
	
	for (var i in distIDs) {
		//console.log(distIDs[i]);
		dimensions.push(get_name(distIDs[i]));
	}
	x.domain(dimensions);
	//console.log(dimensions);
	//console.log(data);
	
	// Extract the list of dimensions and create a scale for each.
	/*x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
		return d != "name" && (y[d] = d3.scale.linear()
			.domain(d3.extent(cars, function(p) { return +p[d]; }))
			.range([h, 0]));
	}));*/
	
	// Add grey background lines for context.
	background = svg.append("g")
					.attr("class", "background")
					.selectAll("path")
					.data(data)
					.enter().append("path")
					.attr("d", path);
	
	// Add blue foreground lines for focus.
	foreground = svg.append("g")
	  				.attr("class", "foreground")
					.selectAll("path")
	  				.data(data)
					.enter().append("path")
	  				.attr("d", path);
	
	// Add a group element for each dimension.
	var g = svg.selectAll(".dimension")
	  		   .data(dimensions)
			   .enter().append("g")
			   .attr("class", "dimension")
			   .attr("transform", function(d, i) { return "translate(" + x(d) + ")"; })
	  .call(d3.behavior.drag()
		.on("dragstart", function(d) {
		  dragging[d] = this.__origin__ = x(d);
		  background.attr("visibility", "hidden");
		})
		.on("drag", function(d) {
		  dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
		  foreground.attr("d", path);
		  dimensions.sort(function(a, b) { return position(a) - position(b); });
		  x.domain(dimensions);
		  g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
		})
		.on("dragend", function(d) {
		  delete this.__origin__;
		  delete dragging[d];
		  transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
		  transition(foreground)
			  .attr("d", path);
		  background
			  .attr("d", path)
			  .transition()
			  .delay(500)
			  .duration(0)
			  .attr("visibility", null);
		}));
	
	// Add an axis and title.
	g.append("g")
	  .attr("class", "axis")
	  .each(function(d) { d3.select(this).call(axis.scale(y)); })
	  .append("text")
	  .attr("text-anchor", "middle")
	  .attr("y", -9)
	  .text(String);
	
	// Add and store a brush for each axis.
/*	g.append("g")
	  .attr("class", "brush")
	  .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
	.selectAll("rect")
	  .attr("x", -8)
	  .attr("width", 16);*/
	
}

//updateParaCoord([], [], 2010, 12, 2013, 12);

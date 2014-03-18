var margin = {top: 40, right: 50, bottom: 80, left: 60},
    margin2 = {top: 130, right: 50, bottom: 20, left: 65},
    width = 976 - margin.left - margin.right,
    height = 80,	//bar chart height
    height2 = 30;	//timeline height

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),		//bar chat rang
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);
	
	//bar chart domain  
	x.domain([new Date(2010,11, 1), new Date(2013,12, 1)] );
	/*var tempMax = d3.max(TCrimes.map(function(d) { return d.crimes; }));
	var tempMin = d3.min(TCrimes.map(function(d) { return d.crimes; })) - 10000;
	
	y.domain([tempMin, tempMax]);*/
	
	//timeline domain as same as bar chart domain
	y2.domain(y.domain());
  
  	
var brush = d3.svg.brush()
    .x(x)
    .extent([new Date(2010, 11, 1), new Date(2010, 12, 1)])
    .on("brush", brushed);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
	
//brush x axis
var bxA = xAxis.ticks(d3.time.month).tickPadding(0);
	
var barTip = d3.tip()
	.attr('id', 'timeline')
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "Month: <span style='color: yellow'>" + d.month + "</span><br> TotalCrime: <span style='color: yellow'>"  + d.crimes + "</span>";
	})

var brush = d3.svg.brush()
    .x(x)
    .on("brush", brushed);


var svgTimeline = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.call(barTip);


initTimeline(TCrimes);
addTimeline(TCrimes, []);

//initialize timeline
function initTimeline(d) {
	var tempMax = d3.max(TCrimes.map(function(d) { return d.crimes; }));
	var tempMin = d3.min(TCrimes.map(function(d) { return d.crimes; })) - 10000;
	
	y.domain([tempMin, tempMax]);

	//Draw the bars
	svgTimeline.selectAll("rect")
	  .data(d)
	  .enter()
	  .append("rect")
/*	
//it is the bar chart	  	  
  svgTimeline.selectAll(".bar")
      .data(d)
	  .enter()
	  .append("rect")*/
	  //.transition()
	  .attr("id", "bars")
	  .attr("class", "bar")
	  .attr("x", function(d) {
		  return x(new Date(d.date));
		 })
	  .attr("width", 20)
	  .attr("y", function(d) { 
		  return height;
		 })
	  .attr("height", 0)
	  .attr("transform", "translate( " + 65  + "," + margin.top + ")")
	  .on('mouseover', barTip.show)
      .on('mouseout', barTip.hide);
	  
	//add y axis
	svgTimeline.append("g")
	  .attr("id", "y-axis")
   	  .attr("transform", "translate( " + margin.left + "," + margin.top + ")")
      .attr("class", "y axis")
      .call(yAxis);

	// add timeline below the bar chart	  
	svgTimeline.append("rect")
		.attr("class", "grid-background")
		.attr("width",  width)
		.attr("height", height)
		.attr("transform", "translate( " + margin.left + "," + margin2.top + ")");
	
	//add x axis
	svgTimeline.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate( " + margin.left + "," + margin2.top + ")")
		.call(xAxis)
		.selectAll("text")
		.attr("x", 6)
		.attr("y", -12)	
		.attr("transform", "rotate(90)")
		.style("text-anchor", null);
		
	var gBrush = svgTimeline.append("g")
		.attr("class", "brush")
		.attr("transform", "translate( " + margin.left + "," + margin2.top + ")")
		.call(brush);
	
	gBrush.selectAll("rect")
		.attr("height", height);
}

//add timeline
function addTimeline(d, id){
	
	if (id.length === 0) {
		for (var i = 1; i <= 45; i++) {
			if (i != 44) {
				id.push(i);
			}
		}
	}
		
	cal_crimes_perDist(id);
			
	tempMax = d3.max(dataNew.map(function(d) { return d.crimes; }));
	tempMin = d3.min(dataNew.map(function(d) { return d.crimes; })) - 1000;
	y.domain([tempMin, tempMax]);
		
	//console.log("tempMax" + tempMax);
	
	//Draw the bars
	svgTimeline.selectAll("rect")
	  .data(dataNew)
  	  .transition()
	  .duration(1000)
	  .attr("y", function(d) { 
		  return y(d.crimes);
		 })
	  .attr("height", function(d) { 
	  return height - y(d.crimes);
	  });

   svgTimeline.select("#y-axis")
   	  .transition()
	  .duration(1000)
   	  .attr("transform", "translate( " + margin.left + "," + margin.top + ")")
      .attr("class", "y axis")
      .call(yAxis);

}
		

function brushed() {
  var extent0 = brush.extent(),
      extent1;

  // if dragging, preserve the width of the extent
  if (d3.event.mode === "move") {
    var d0 = d3.time.month.round(extent0[0]),
        d1 = d3.time.month.offset(d0, Math.round((extent0[1] - extent0[0]) / 2678400000));
    extent1 = [d0, d1];
  }

  // otherwise, if resizing, round both dates
  else {
    extent1 = extent0.map(d3.time.month.round);

    // if empty when rounded, use floor & ceil instead
    if (extent1[0] >= extent1[1]) {
      extent1[0] = d3.time.month.floor(extent0[0]);
      extent1[1] = d3.time.month.ceil(extent0[1]);
    }
  }
  d3.select(this).call(brush.extent(extent1));
  
  beginDate = extent1[0];
  endDate = d3.time.day.offset(extent1[1], -1);
  console.log([beginDate, endDate]);
  
  var beginYear = beginDate.getFullYear(),
  	  beginMonth = beginDate.getMonth() + 1,
	  endYear = endDate.getFullYear(),
	  endMonth = endDate.getMonth() + 1;
  updateMap(beginYear, beginMonth, endYear, endMonth);
}

function type(d) {
	for(var i in d){
	  d[i].date = new Date(d[i].date);
	  //console.log(d[i].date);
	  d[i].TotalCrime = +d[i].TotalCrime;
	}
  return d;
}

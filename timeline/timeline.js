var margin = {top: 10, right: 10, bottom: 100, left: 60},
    margin2 = {top: 430, right: 10, bottom: 20, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),		//bar chat rang
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);
	
//this is bar chart	
var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x( d.date); })
    .y(function(d) { return y(d.TotalCrime); });

//this is timeline
var line2 = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.TotalCrime); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("total.csv", function(error, data) {
    
  //bar chart domain  
  x.domain([new Date(2010,12), new Date(2013,12)] );
  y.domain([428000, 620000]);
  
 //timeline domain as same as bar chart domain
  x2.domain(x.domain());
  y2.domain(y.domain());

  data = type(data);


 focus.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
      console.log("this");

});

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".line").attr("d", line);
  focus.select(".x.axis").call(xAxis);
}

function type(d) {
	for(var i in d){
	  d[i].date = new Date(d[i].date);
	  console.log(d[i].date);
	  d[i].TotalCrime = +d[i].TotalCrime;
	}
  return d;
}
var maxWidth=Math.max(600,Math.min(screen.height,screen.width)-350);

var width = (maxWidth / 2),
    height = width - 100,
    monthWidth=(height*2)-250;
    
var maxMonth=1,
     maxYear=3,
     baseYear=2011,
     months=[],
     monthlyExports=[],
     monthlyImports=[],
     running=true,
     refreshIntervalId,
     year= 0,
     month=-1,
		 monthOffset = (monthWidth)/(maxYear*12+maxMonth);
		 
var monthsMap=["Jan","Feb","Mar","Apr","May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 


//var parseDate = d3.time.format("%b %Y").parse;
//console.log(parseDate);

//scales

var 
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear()
				.domain([0, 37])
				.range([0, height]);
    
    
var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
    
var brush = d3.svg.brush()
    .x(x)
    .on("brush", brushed);
    
function brushed() {
  x.domain(brush.empty() ? x.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });
    
var svg = d3.select(document.getElementById("svgDiv"))
    .style("width", (width*3) + "px")
    .style("height", (width*3) + "px")
    .append("svg")
    .attr("id","svg")

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + 50 + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + 470 + ")");
    
  
d3.select(document.getElementById("imgDiv"))
    .style("left",((maxWidth-monthWidth)/2-(50))+"px");
    
    
var mGroup=svg.append("g")
    .attr("class","months")
    .attr("transform", "translate(" + (width-height+125) + ","  + 40 + ")");
    
  
    
var eGroup=svg.append("g")
    .attr("class","exports")
    .attr("transform", "translate(" + width + "," + (width+70) + ")");

var iGroup=svg.append("g")
    .attr("class","imports")
    .attr("transform", "translate(" + width + "," + (width+70) + ")");
    
    
    
var playPause=d3.select(document.getElementById("playPause"));


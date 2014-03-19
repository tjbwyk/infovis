var Width = 160, Height = 45;


displayDistName(TCrimes, []);

function displayDistName(TCrimes, id){

var name = [];

var graypanel = d3.select("#distNames");  
 
graypanel.selectAll("text").remove(); 

	if(id.length === 0){
		
		graypanel.append("text")
		.attr("class", "names")
		.attr("width", Width)
		.text("All Districts");
		displayCrimenumbers(19078624);
			
	}else{
		
		totalcrimes = get_dists_all(id);
		
		for (var i in id){
			name[i] = get_name(id[i]);	
		}
		
		console.log("names: " + name);
		
		graypanel.append("text")
			.attr("class", "names")
			.attr("width", Width)
			.text(name);
			
		displayCrimenumbers(totalcrimes);
	}

}

function displayCrimenumbers(numbers){	
	
//var Px = d3.scale.linear().range([0, Width]).domain(0, 19078624);

var total = d3.select("#totalcrimes");

total.selectAll("p").remove();

total.append("p")
			.attr("class", "number")
			.attr("width", Width)
			.text(numbers);

total.selectAll("rect").remove();

/*total.append("rect")
	.attr("x", 10)
	.attr("y", 0)
	.attr("id", "bars")
	.attr("class", "bar")
	.attr("width", 19078624/numbers)
	.attr("height", 10)
	.attr("transform", "translate( " + 65  + ", 40)")
	.text(numbers);
	
			
console.log("crimenumbers" + numbers);*/

}
var Width = 160, Height = 45;


displayDistName(TCrimes, []);

function displayDistName(TCrimes, id){

var name = [];

var id = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45];

var graypanel = d3.select("#distNames");  
 
graypanel.selectAll("text").remove(); 

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
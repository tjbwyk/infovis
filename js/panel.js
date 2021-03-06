var Width = 160, Height = 45;

displayDistName(TCrimes, id);

function displayDistName(TCrimes, id){
	
	var name = [];
	
	if (id.length === 0) {
		id = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45];
		name = "All Districts";
	} else {
		for (var i in id) {
			name[i] = get_name(id[i]);	
		}
	}
	
	var graypanel = d3.select("#distNames");  
	
	graypanel.selectAll("text").remove(); 

	totalcrimes = get_dists_all(id);
	
//	console.log("names: " + name);
	
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

function checkbox(){

	var str = document.getElementsByName("CrimeType");
	var box = document.getElementsByName("CrimeTypeBox");
	console.log(str);
	for (var i =0; i < 16; i ++){
		//console.log(str[i].value);
		if(str[i].checked === true){
			typeID[parseInt(str[i].value)] = 1;
			box[i].style.backgroundImage = "url(" + str[i].getAttribute('sel') + ")";
		} else {
			typeID[parseInt(str[i].value)] = 0;
			box[i].style.backgroundImage = "url(" + str[i].getAttribute('unsel') + ")";
		}
	}
	//console.log(typeID);
	calTypes(typeID);
}


//calculate by crime types and update map & timeline bar & total crime numbers
function calTypes(typeID){
	var crimenumbers, temp = 0;
	Crimetype = [];	
	
	for (var i in typeID){
		if (typeID[i] === 1){
			//console.log(i);
			Crimetype.push(i);
		}
	}
	//console.log("id" + id);
	
	updateTimeline(get_selected_crimeIDs(), TCrimes, get_selected_distIDs());
	updateMap(get_selected_crimeIDs(), bYear, bMonth, eYear, eMonth);
	updateParaCoord(get_selected_distIDs(), get_selected_crimeIDs(), bYear, bMonth, eYear, eMonth);
	
	//displayCrimenumbers(TotalCrimeNumbers);
}

checkbox();
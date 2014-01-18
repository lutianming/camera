var properties = ["model", "date", "max_reso", "low_reso", "pixels",
		  "zoom_W", "zoom_T", "normal_focus", "macro_focus",
		  "storage", "weight", "dimensions", "price"];
var number_properties = properties.slice(1);
var bar_properties = properties.slice(2);

var brand = ["Agfa", "Canon", "Casio", "Epson", "Fujifilm", "HP",
	     "JVC", "Kodak", "Kyocera", "Leica","Nikon", "Olympus",
	    "Panasonic", "Pentax", "Ricoh", "Samsung", "Sanyo", "Sony",
	    "Toshiba"];
var data = [];
var max_value = {};
var min_value = {};
function parse_data(){
    d3.csv("camera.csv", function(d){
	//callback, store data in var
	for(var i=0; i<d.length; i++){
	    var tmp = d[i];
	    tmp = {
		model: tmp.model,
		date: +tmp.release_date,
		max_reso: +tmp.max_reso,
		low_reso: +tmp.low_reso,
		pixels: +tmp.pixels,
		zoom_W: +tmp.zoom_W,
		zoom_T: +tmp.zoom_T,
		normal_focus: +tmp.normal_focus,
		macro_focus: +tmp.macro_focus,
		storage: +tmp.storage,
		weight: +tmp.weight,
		dimensions: +tmp.dimensions,
		price: +tmp.price
	    };
	    data.push(tmp);
	}

	//get max and min values
	for(var i = 0; i < number_properties.length; i++){
	    var p = number_properties[i];
	    max_value[p] = d3.max(data, function(d){
		return d[p];
	    });
	    min_value[p] = d3.min(data, function(d){
		return d[p];
	    });
	}
//	load_data(data, properties);
//	show_table(data, properties);
	load_filter();
    });
}

function load_data(data, columns){
    var table = d3.select("#diagram").append("table").attr("class", "table table-striped");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d.value; });
    return table;
}

function load_filter(){
    d3.select("#brand").selectAll("option")
    .data(brand)
    .enter()
    .append("option")
    .text(function(d) {return d;})
    .attr("value", function(d){ return d;});

    $("#date-slider").noUiSlider({
	range:[min_value["date"], max_value["date"]],
	start:[min_value["date"], max_value["date"]],
	serialization: {
	    resolution: 1
	    ,to: [$("#date-min"), $("#date-max")]
	}
    });
}
$(function(){
    parse_data();
})

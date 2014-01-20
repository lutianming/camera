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


//current display function
var current_diagram_f = show_table;
var subdata = data; //subdata by filter
var subcolumns = properties; //subcolumns by filter
var filter;  //current filter


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
	load_filter();
	show_table(data, properties);
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
    d3.select("#model").selectAll("option")
    .data(brand)
    .enter()
    .append("option")
    .text(function(d) {return d;})
    .attr("value", function(d){ return d;});

    $("#model").multiselect();

    for(var i = 0; i < number_properties.length; i++){
	var p = number_properties[i];
	$("#"+p+"-slider").noUiSlider({
	    range: [min_value[p], max_value[p]],
	    start: [min_value[p], max_value[p]],
	    serialization: {
		resolution: 1,
		to: [$("#"+p+"-min"), $("#"+p+"-max") ]
	    }
	});

	$("#"+p).click(function(){
	    if(this.checked){
		$("#"+this.id+"-panel").show("fast");
	    }else{
		$("#"+this.id+"-panel").hide("fast");
	    }
	});
    }
}

function get_filter(){
    var values = {};
    values["model"] = $("#model").val();
    for(var i = 0; i < number_properties.length; i++){
	var p = number_properties[i];
	if($("#"+p).prop("checked")){
	    values[p] = $("#"+p+"-slider").val();
	}
    };
    return values;
}

function filter_data(data, filter){
    var result = data.filter(function(d){
	var re = true;
	for(var p in filter){
	    var value = filter[p];
	    if(p == "model"){
		var contained = false;
		for(var i = 0; i < value.length; i++){
		    var brand = value[i];
		    if(d[p].indexOf(brand) != -1){
			contained = true;
			break;
		    }
		}
		if(!contained){
		    re = false;
		    break;
		}
	    }
	    else{
		if(d[p] < value[0] || d[p] > value[1]){
		    re = false;
		    break;
		}
	    }
	}
	return re;
    });
    return result;
}

function diagram_update(data, columns){
    d3.selectAll("#diagram").remove();
    d3.select("#container")
	.append("div")
	.attr("id", "diagram");
    current_diagram_f(data, columns);
}

function function_clicked(display_f){
    if(current_diagram_f != display_f){
	current_diagram_f = display_f;
	diagram_update(subdata, subcolumns);
    }
}

function show_filter(){
    $("#filterPanel").show("fast");
}

function filter_clicked(){
    filter = get_filter();
    subdata = filter_data(data, filter);
    subcolumns = Object.keys(filter);
    filter_table(subdata.map(function(d){ return d["model"];}));
//    diagram_update(subdata, subcolumns);
}

//hide filter panel
$(document).click(function(event) {
    if($(event.target).parents().index($('#filterPanel')) == -1) {
        if($('#filterPanel').is(":visible")) {
            $('#filterPanel').hide();
        }
    }
})

$(function(){
    parse_data();
})

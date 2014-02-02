var colors = {};
var colorgen = d3.scale.category20();
for(var i = 0; i < brand.length; i++){
    colors[brand[i]] = colorgen(i);
}

function get_color(d){
    return colors[d.model.split(" ")[0]];
}

var data = [];
var value_range = {};

//current display function
var current_diagram_f = slick_table;
var subdata = data; //subdata by filter
var subcolumns = properties; //subcolumns by filter
var filter;  //current filter

function parse_data(){
    d3.csv("camera.csv", function(d){
	//callback, store data in var
	for(var i = 0; i<d.length; i++){
	    var tmp = d[i];
	    tmp = {
		model: tmp.model,
		brand: tmp.model.split(" ")[0],
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
	    value_range[p] = d3.extent(data, function(d){
		return d[p];
	    });
	}

	load_filter();
	current_diagram_f("#diagram", data, detailed_properties);
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

    var h_runfilters = null;
    function multiselect_selected($el) {
	var ret = true;
	$('option', $el).each(function(element) {
	    if (!!!$(this).prop('selected')) {
		ret = false;
	    }
	});
	return ret;
    }
    /**
     * Selects all the options
     * @param {jQuery} $el
     * @returns {undefined}
     */
    function multiselect_selectAll($el) {
	$('option', $el).each(function(element) {
	    $el.multiselect('select', $(this).val());
	});
    }
    /**
     * Deselects all the options
     * @param {jQuery} $el
     * @returns {undefined}
     */
    function multiselect_deselectAll($el) {
	$('option', $el).each(function(element) {
	    $el.multiselect('deselect', $(this).val());
	});
    }
    /**
     * Clears all the selected options
     * @param {jQuery} $el
     * @returns {undefined}
     */
    function multiselect_toggle($el, $btn) {
	if (multiselect_selected($el)) {
	    multiselect_deselectAll($el);
	    $btn.text("Select All");
	}
	else {
	    multiselect_selectAll($el);
	    $btn.text("Deselect All");
	}
    }

    $("#model").multiselect();
    $("#model").change(function(){
	window.clearTimeout(h_runfilters);
	h_runfilters = window.setTimeout(update_filter, 10);
    })
    $("#model-toggle").click(function(e){
	e.preventDefault();
	multiselect_toggle($("#model"), $(this));
    });
    multiselect_selectAll($("#model"));
    $("#model-toggle").text("Deselect All");

    for(var i = 0; i < number_properties.length; i++){
	var p = number_properties[i];
	// $("#"+p+"-slider").noUiSlider({
	//     range: [value_range[p][0], value_range[p][1]],
	//     start: [value_range[p][0], value_range[p][1]],
	//     serialization: {
	// 	resolution: 1,
	// 	to: [$("#"+p+"-min"), $("#"+p+"-max") ]
	//     }
	// });

	var s = $("#"+p+"-slider");
	s.slider({
	    range: true,
	    min: value_range[p][0],
	    max: value_range[p][1],
	    values: value_range[p],
	    slide: function( event, ui ) {
		id = $(this).attr('id');
		$("#"+id.split("-")[0]+"-input").val(ui.values[0]+" - "+ui.values[1]);
		window.clearTimeout(h_runfilters);
		h_runfilters = window.setTimeout(update_filter, 10);
	    }
	});

	$("#"+p+"-input").val(s.slider("values", 0) +" - " + s.slider("values", 1));

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
	    values[p] = $("#"+p+"-slider").slider("values");
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
    if(current_diagram_f == show_table){
	filter_table(subdata.map(function(d){ return d["model"];}));
    }else if(current_diagram_f == show_parallel){
	filter_parallel(columns);
    }else if(current_diagram_f == slick_table){

    }

}

function function_clicked(display_f){
    if(current_diagram_f != display_f){
	current_diagram_f = display_f;
	init_diagram();
	current_diagram_f("#diagram", subdata, subcolumns);
    }
}
function init_diagram(){
    d3.selectAll("#diagram").remove();
    d3.select("#container")
    	.append("div")
    	.attr("id", "diagram");
}
function show_filter(){
    $("#filterPanel").show("fast");
}

function filter_clicked(){
    // filter = get_filter();
    // subdata = filter_data(data, filter);
    // subcolumns = Object.keys(filter);
    // diagram_update(subdata, subcolumns);
    update_filter();
}

//hide filter panel
$(document).click(function(event) {
    if($(event.target).parents().index($('#filterPanel')) == -1) {
        if($('#filterPanel').is(":visible")) {
            $('#filterPanel').hide();
        }
    }
});

$(function(){
    parse_data();
});

function table_click(){
    init_diagram();
    slick_table("#diagram", data, detailed_properties);
}

function matrix_click(){
    init_diagram();
    show_matrix("#diagram", data.slice(0,50), properties);
}

function parrallel_click(){
    init_diagram();
    d3.select("#diagram")
	.append("div")
	.attr("id", "parrallel");
    d3.select("#diagram")
	.append("div")
	.attr("id", "table");
    slick_table("#table", data, detailed_properties);
    show_parallel("#parrallel", data, detailed_properties);
}

function radar_click(){
    var index = grid.getSelectedRows();
    if(index.length == 0){
	alert("please choose at least one camera from table")
	return;
    }
    var items = [];
    for(var i = 0; i < index.length; i++){
	items.push(data[index[i]]);
    }
    init_diagram();
    show_radar("#diagram", items, number_detailed_properties);
}

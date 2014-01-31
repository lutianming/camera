function show_table(data, columns){
    var table = d3.select("#diagram").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    thead.append("tr")
	.selectAll("th")
	.data(columns)
	.enter()
	.append("th")
	.text(function(d) { return d; });

    d3.selectAll("thead th").data(columns).on("click", function(k) {
	rows.sort(function(a, b) { return b[k] - a[k]; });
    });

    var rows = tbody
	.selectAll("tr")
	.data(data)
	.enter()
	.append("tr")
	.attr("id", function(d){ return d["model"]; });

    rows.selectAll("td")
	.data(function(row) { return columns.map(function(column){
	    return {column: column, value: row[column]};
	});})
	.enter().append("td")
	.each(function(d){
	    var header = d3.select(this);
	    if (bar_properties.indexOf(d.column) > -1){
		header.append("svg")
		    .attr("width", 80)
		    .attr("height", 6)
		    .append("rect")
		    .attr("height", "100%")
		    .attr("width", function(d) { return d.value / value_range[d.column][1] * 80; });
	    }
	    else{
		header.text(function(d) { return d.value;});
	    }
	});
}

function filter_table(shown_data){
    var rows = d3.selectAll("tbody tr").each(function(d, i){
	var tr = $(this);
	if(shown_data.indexOf(tr.attr("id")) != -1){
	    tr.css({"display":""});
	}else{
	    tr.css({"display": "none"});
	}
    });
}

function formatter(row, cell, value, columnDef, dataContext) {
    if(columnDef.name == "model" || columnDef.name == "date"){
	return value;
    }
    else{
	var color = "blue";
	var v = value/(value_range[columnDef.field][1]) * 80;
	v = Math.round(v);
	// return "<span class='percent-complete-bar' style='background:" + color + ";width:" + v + "%'></span>";
	return "<svg width='80' height='12'><rect height='100%' width='"+ v + "'></rect></svg>";
    }

}

function slick_table(id, data, columns){
    var grid;
    for(var i = 0; i < columns.length; i++){
	var c = columns[i];
	c["formatter"] = formatter;
    }

    var options = {
	editable: false,
	enableAddRow: false,
	enableCellNavigation: true
    };

    grid = new Slick.Grid(id, data, columns, options);
}

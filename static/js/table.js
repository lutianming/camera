function show_table(data, columns){
    var table = d3.select("#diagram").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    thead.append("tr")
	.selectAll("th")
	.data(columns)
	.enter()
	.append("th")
	.text(function(d) { return d});

    d3.selectAll("thead th").data(columns).on("click", function(k) {
	rows.sort(function(a, b) { return b[k] - a[k]; });
    });

    var rows = tbody
	.selectAll("tr")
	.data(data)
	.enter()
	.append("tr");

    rows.selectAll("td")
	.data(function(row) { return columns.map(function(column){
	    return {column: column, value: row[column]}
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
		    .attr("width", function(d) { return d.value / max_value[d.column] * 80; });
	    }
	    else{
		header.text(function(d) { return d.value});
	    }
	});
}

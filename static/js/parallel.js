var pc;
function show_parallel(id, data, columns){
    $(id).empty();
    $(id).append('<div id="parallel-widgets" class="widgets"></div');

    d3.select("#parallel-widgets").append('div')
    .append("button")
    .text("Reset brush")
    .on("click", function(){
	pc.brushReset();
    });

    $("#parallel-widgets").append("<div id='parallel-legend' class='legend'></>");

    $.each(brand, function(i, b) {
    	$('#parallel-legend').append("<div class='item'><div class='color' style='background: " + colors[b] + "'></div><div class='key'>" + b + "</div></div>");
    });

    $(id).append("<div id='parcoords' class='parcoords'></div>");
    // d3.selectAll(id)
    // .attr("class", "parcoords");
    pc = d3.parcoords()("#parcoords")
	.data(data)
	.color(get_color)
	.mode("queue")
	.render()
	.brushable()
	.reorderable()
	.interactive();
    pc.on("brush", function(d){
	if(dataview){
	    dataview.beginUpdate();
	    dataview.setItems(d, ["model"]);
	    dataview.endUpdate();
	}
    });
}

function filter_parallel(columns){
    pc.dimensions(columns);
}

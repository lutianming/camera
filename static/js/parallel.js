var pc;
function show_parallel(id, data, columns){
    $(id).append('<div id="widgets"></div');

    d3.select("#widgets").append('div')
    .append("button")
    .text("Reset brush")
    .on("click", function(){
	pc.brushReset();
    });

    $("#widgets").append("<div id='legend'></>");

    $.each(brand, function(i, b) {
    	$('#legend').append("<div class='item'><div class='color' style='background: " + colors[b] + "'></div><div class='key'>" + b + "</div></div>");
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
    })
}

function filter_parallel(columns){
    pc.dimensions(columns);
}

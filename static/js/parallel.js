var pc;
function show_parallel(id, data, columns){
    d3.select("#diagram").append('div')
    .append("button")
    .text("Reset brush")
    .on("click", function(){
	pc.brushReset();
    });

    d3.selectAll("#diagram")
    .attr("class", "parcoords");
    pc = d3.parcoords()(id)
	.data(data)
	.color(get_color)
	.mode("queue")
	.render()
	.brushable()
	.reorderable()
	.interactive();
}

function filter_parallel(columns){
    pc.dimensions(columns);
}

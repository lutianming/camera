var pc;
function show_parallel(data, columns){
    d3.selectAll("#diagram")
    .attr("class", "parcoords");
    pc = d3.parcoords()("#diagram")
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

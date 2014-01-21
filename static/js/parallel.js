var pc;
function show_parallel(data, columns){
    pc = d3.parcoords()("#diagram")
	.data(data)
	.dimensions(columns)
	.createAxes()
	.height(600)
	.render();
}

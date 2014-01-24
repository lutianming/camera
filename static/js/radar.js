function show_radar(id,data,columns){

    var number_elements = data.length;
    var number_columns = columns.length;

    var d  = [];



    for(var i=0; i<number_elements; i++){
	var obj = [];
	var tmp = data[i];
	for(var j=0; j<number_columns; j++){
	    var col = columns[j]["field"];
	    obj.push({
		axis: columns[j]["name"],
		value: tmp[col]
            });
	}
	d.push(obj);
    }


var mycfg = {
    color: function(){
	c = ['red', 'yellow', 'pink', 'green', 'blue', 'olive', 'aqua', 'cadetblue', 'crimson'];
	m = c.length - 1;
	x = parseInt(Math.random()*100);
	return c[x%m]; //Get a random color
    }
};

    RadarChart.draw(id, d, mycfg);

}

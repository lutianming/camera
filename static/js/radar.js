function show_radar(id,data,columns){
    $(id).empty();
    $(id).append("<div id='radar-widgets' class='widgets'></div>");
    $(id).append("<div id='radar-photo' class='radar'></div>");
    $(id).append("<div id='radar-physique' class='radar'></div>");
    $(id).append("<div id='sample-value' class='radar panel panel-primary'></div>");

    $("#radar-widgets").append("<div id='radar-legend' class='legend'></>");
    $.each(data, function(i, d) {
    	// $('#radar-legend').append("<div class='item'><div class='color' style='background: " + colorgen(i) + "'></div><div class='key'>" + b.model + "</div></div>");

	var tooltip = "";
	for(var j=0; j<columns.length; j++){
	    var c = columns[j];
	    tooltip += c.name + ":" + d[c.field] + "<br />";
	}
    	$('#radar-legend').append("<div class='item'><div class='color' style='background: " + colorgen(i) + "'></div><button type='button' class='btn btn-xs' data-container='body' data-toggle='popover' data-placement='bottom' data-content='"+ tooltip +"'>" + d.model + "</button></div>");
    });
    $('button').popover({
	html: true
    });

    var physique_properties = ["storage", "weight", "dimensions", "price"];
    var d_photo  = [];
    var d_physique = [];
    for(var i=0; i<data.length; i++){
	var obj_a = [];
	var obj_b = [];
	var tmp = data[i];
	for(var j=0; j<columns.length; j++){
	    var col = columns[j]["field"];
	    if(col == "date"){
		continue;
	    }else if(physique_properties.indexOf(col) > -1){
		obj_a.push({
		    axis: columns[j]["name"],
		    value: tmp[col]/value_range[col][1],
		    tooltip: tmp[col]
		});
	    }else{
		obj_b.push({
		    axis: columns[j]["name"],
		    value: tmp[col]/value_range[col][1],
		    tooltip: tmp[col]
		});
	    }
	}
	d_photo.push(obj_a);
	d_physique.push(obj_b);
    }

    var w = 300,
    h = 300;
    var mycfg = {
	color: colorgen,
	maxValue: 1,
	w: w,
	h: h,
	ExtraWidthX: 150,
	ExtraWidthY: 150,
	levels: 6,
	tooltip: function(d){ return d.tooltip; }
    };
    RadarChart.draw("#radar-photo", d_photo, mycfg);
    RadarChart.draw("#radar-physique", d_physique, mycfg);


    //legend
    // var svg = d3.select('#widgets')
    // 	.selectAll('svg')
    // 	.append('svg')
    // 	.attr("width", w+300)
    // 	.attr("height", h);

    // //Create the title for the legend
    // var text = svg.append("text")
    // 	.attr("class", "title")
    // 	.attr('transform', 'translate(90,0)')
    // 	.attr("x", w - 70)
    // 	.attr("y", 10)
    // 	.attr("font-size", "12px")
    // 	.attr("fill", "#404040")
    // 	.text("What % of owners use a specific service in a week");

    // //Initiate Legend
    // var legend = svg.append("g")
    // 	.attr("class", "legend")
    // 	.attr("height", 100)
    // 	.attr("width", 200)
    // 	.attr('transform', 'translate(90,20)');

    // //Create colour squares
    // legend.selectAll('rect')
    // 	.data(data)
    // 	.enter()
    // 	.append("rect")
    // 	.attr("x", w - 65)
    // 	.attr("y", function(d, i){ return i * 20;})
    // 	.attr("width", 10)
    // 	.attr("height", 10)
    // 	.style("fill", function(d, i){ return colorscale(i);});

    // //Create text next to squares
    // legend.selectAll('text')
    // 	.data(data)
    // 	.enter()
    // 	.append("text")
    // 	.attr("x", w - 52)
    // 	.attr("y", function(d, i){ return i * 20 + 9;})
    // 	.attr("font-size", "11px")
    // 	.attr("fill", "#737373")
    // 	.text(function(d) { return d.model; });

}

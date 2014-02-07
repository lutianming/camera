var grid;
var dataview;
var selected_items = [];
var attrcolors = {};

for(var i = 0; i < detailed_properties.length; i++){
    var p = detailed_properties[i];
    attrcolors[p.field] = colorgen(i);
}
function get_attr_color(f){
    return attrcolors[f];
}

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
    var color = get_attr_color(columnDef.field);
    if(columnDef.field == "model" || columnDef.field == "date"){
	return "<p style='color:" + color + "' title='" + value +"'>" + value + "</p>";
    }
    else{
	var v = value/(value_range[columnDef.field][1]) * 80;
	v = Math.round(v);

	// var svg = "<svg width='80' height='12' title='"+ value + "'> \
	//     <rect height='100%' width='"+ v + "' style='fill:" + color +"'></rect> \
	//     <text x='0' y='8' dy='.1em' style='display:none'>" + value +"</text> \
	// </svg>";
	var svg = "<svg width='80' height='12' title='"+ value + "'> \
	    <rect height='100%' width='"+ v + "' style='fill:" + color +"'></rect> \
	</svg>";
	return svg;
    }

}

function slick_table(id, data, columns){
    for(var i = 0; i < columns.length; i++){
	var c = columns[i];
	c["formatter"] = formatter;
	c["resizable"] = true;
	c["sortable"] = true;
    }

    var options = {
	editable: false,
	enableAddRow: false,
	enableCellNavigation: true,
	fullWidthRows: true,
	forceFitColumns: true,
	rowHeight: 14
    };

    dataview = new Slick.Data.DataView();
    grid = new Slick.Grid(id, dataview, columns, options);
    grid.setSelectionModel(new Slick.RowSelectionModel());
    // grid.registerPlugin(new Slick.AutoTooltips({
    // 	enableForCells:true
    // }));

    grid.onKeyDown.subscribe(function (e) {
	// select all rows on ctrl-a
	if (e.which != 65 || !e.ctrlKey) {
	    return false;
	}

	var rows = [];
	for (var i = 0; i < dataView.getLength(); i++) {
	    rows.push(i);
	}

	grid.setSelectedRows(rows);
	e.preventDefault();
	return true;
    });

    grid.onSelectedRowsChanged.subscribe(function(e, args){
	var index = grid.getSelectedRows();
	if(pc){
	    selected_items = [];
	    if(index.length == 0){
		pc.unhighlight();
	    }else{
		for(var i = 0; i<index.length; i++){
		    selected_items.push(data[index[i]]);
		}
		pc.highlight(selected_items);
	    }
	}
	if(index.length > 0){
	    show_radar("#radar", selected_items, number_detailed_properties);
	}
    });

    grid.onMouseEnter.subscribe(function(e, args){
    	var cell = grid.getCellFromEvent(e);
    	var item = dataview.getItem(cell.row);
    	pc.highlight(selected_items.concat([item]));
    });
    grid.onMouseLeave.subscribe(function(e, args){
    	// var cell = grid.getCellFromEvent(e);
    	// var item = dataview.getItem(cell.row);
	if(selected_items.length == 0){
	    pc.unhighlight();
	}else{
	    pc.highlight(selected_items);
	}

    });

    grid.onCellChange.subscribe(function (e, args) {
	dataView.updateItem(args.item.id, args.item);
    });

    dataview.onRowCountChanged.subscribe(function (e, args) {
	grid.updateRowCount();
	grid.render();
    });

    dataview.onRowsChanged.subscribe(function (e, args) {
	grid.invalidateRows(args.rows);
	grid.render();
    });

    grid.onSort.subscribe(function(e, args) {
	var comparer = function(a, b) {
	    var x = a[args.sortCol.field], y = b[args.sortCol.field];
	    return (x == y ? 0 : (x > y ? 1 : -1));
	};
	dataview.sort(comparer, args.sortAsc);
    });

    dataview.beginUpdate();
    dataview.setItems(data, ["model"]);
    dataview.setFilterArgs(get_filter());
    dataview.setFilter(table_filter);
    dataview.endUpdate();

    $(document).tooltip();
}

function table_filter(item, args){
    var re = true;
    for(var p in args){
	var value = args[p];
	if(p == "model"){
	    var contained = false;
	    for(var i = 0; i < value.length; i++){
		var brand = value[i];
		if(item[p].indexOf(brand) != -1){
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
	    if(item[p] < value[0] || item[p] > value[1]){
		re = false;
		break;
	    }
	}
    }
    return re;
}

function update_filter(){
    dataview.setFilterArgs(get_filter());
    dataview.refresh();
}

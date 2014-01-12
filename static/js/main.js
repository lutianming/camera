var properties = ["model", "date", "max_reso", "low_reso", "pixels",
		  "zoom_W", "zoom_T", "normal_focus", "macro_focus",
		  "storage", "weight", "dimensions", "price"];
var brand = ["Agfa", "Canon", "Casio", "Epson", "Fujifilm", "HP",
	     "JVC", "Kodak", "Kyocera", "Leica","Nikon", "Olympus",
	    "Panasonic", "Pentax", "Ricoh", "Samsung", "Sanyo", "Sony",
	    "Toshiba"];
var data = [];
function parse_data(){
    d3.csv("camera.csv", function(d){
	//callback, store data in var
	for(var i=0; i<d.length; i++){
	    var tmp = d[i];
	    tmp = {
		model: tmp.model,
		date: +tmp.release_date,
		max_reso: +tmp.max_reso,
		low_reso: +tmp.low_reso,
		pixels: +tmp.pixels,
		zoom_W: +tmp.zoom_W,
		zoom_T: +tmp.zoom_T,
		normal_focus: +tmp.normal_focus,
		macro_focus: +tmp.macro_focus,
		storage: +tmp.storage,
		weight: +tmp.weight,
		dimensions: +tmp.dimensions,
		price: +tmp.price
	    };
	    data.push(tmp);
	}
	load_data(data, properties);
    });
}

function load_data(data, columns){
    var table = d3.select("#subcontainer").append("table").attr("class", "table table-striped");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d.value; });
    return table;
}
parse_data();

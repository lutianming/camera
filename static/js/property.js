var properties = ["model", "date", "max_reso", "low_reso", "pixels",
		  "zoom_W", "zoom_T", "normal_focus", "macro_focus",
		  "storage", "weight", "dimensions", "price"];
var detailed_properties = [
    {id:"model", name:"model", field:"model", minWidth: 140, unit:"", toolTip: "model"},
    {id: "date", name:"release date", field:"date", maxWidth: 40, unit:"", toolTip:"release date"},
    {id: "max_reso", name:"max resolution", field:"max_reso", minWidth: 80, unit:"", toolTip:"max resolution"},
    {id: "low_reso", name:"low resolution", field:"low_reso", minWidth: 80, unit:"", toolTip:"low resolution"},
    {id: "pixels",name: "pixels",field: "pixels", minWidth: 80, unit:"mp", toolTip:"pixels(mp)"},
    {id: "zoom_W", name:"zoom Wide", field:"zoom_W", minWidth: 80, unit:"mm", toolTip:"zoom Wide(mm)"},
    {id: "zoom_T", name:"zoom Tele", field:"zoom_T", minWidth: 80, unit:"mm", toolTip:"zoom Tele(mm)"},
    {id: "normal_focus", name: "normal focus range", field: "normal_focus", minWidth: 80, unit:"mm", toolTip:"normal focus range(mm)"},
    {id: "macro_focus", name: "macro focus range", field: "macro_focus", minWidth: 80, unit:"mm", toolTip:"macro focus range(mm)"},
    {id: "storage", name: "storage", field: "storage", minWidth: 80, unit:"MB", toolTip:"storage(MB)"},
    {id: "weight", name: "weight", field: "weight", minWidth: 80, unit:"g", toolTip:"weight(g)"},
    {id: "dimensions", name: "dimensions", field: "dimensions", minWidth: 80, unit:"mm", toolTip:"dimensions(mm)"},
    {id: "price", name: "price", field: "price", minWidth: 80, unit:"$", toolTip:"price($)"}
];
var number_detailed_properties = detailed_properties.slice(1);

var number_properties = properties.slice(1);
var bar_properties = properties.slice(2);

var brand = ["Agfa", "Canon", "Casio", "Epson", "Fujifilm", "HP",
	     "JVC", "Kodak", "Kyocera", "Leica","Nikon", "Olympus",
	    "Panasonic", "Pentax", "Ricoh", "Samsung", "Sanyo", "Sony",
	    "Toshiba"];

var colorgen = d3.scale.category20();

function show_radar(data,columns){
  
  
  length; //objects
  number_columns = columns.length;
  number_elements = data.length;
  
  data = [];
  for(var i=0; i<number_elements; i++){
    data.push([
    	
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
    	
    	
           {axis: "Max resolution", value: Math.floor((Math.random()*100)+1)}, 
           {axis: "Low resolution", value: Math.floor((Math.random()*100)+1)}, 
           {axis: "Piexels", value: Math.floor((Math.random()*100)+1)}, 
           {axis: "Zoom W", value: Math.floor((Math.random()*100)+1)},
           {axis: "Zoom T", value: Math.floor((Math.random()*100)+1)},  
           {axis: "Normal Focus", value: Math.floor((Math.random()*100)+1)},  
           {axis: "Macro Focus", value: Math.floor((Math.random()*100)+1)}
          ])
  }
  
  var mycfg = {
  color: function(){
  c = ['red', 'yellow', 'pink', 'green', 'blue', 'olive', 'aqua', 'cadetblue', 'crimson'];
  m = c.length - 1;
  x = parseInt(Math.random()*100);
  return c[x%m]; //Get a random color
}
}
RadarChart.draw("#diagram", d, mycfg);

}

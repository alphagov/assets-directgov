function mouseOverRegion ( region ) {
	document.getElementById('UK_map').src = 'map/map_'+ region + '_e.gif';
}
function mouseOutRegion (){
	document.getElementById('UK_map').src = 'map/map_mo.gif';
}
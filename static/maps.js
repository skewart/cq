

function processBISData( rawData ) {
	var data = []
	for ( var i = 0, rdLen = rawData.length; i < rdLen; i++ ) {
		if ( rawData[i].BIN ) {
			rawData[i].BIN = parseInt( rawData[i].BIN );
		}	
		if ( rawData[i].NumStories ) {
			rawData[i].NumStories = parseInt( rawData[i].NumStories );
		}
		data.push({
			BIN: rawData[i].BIN,
			data: rawData[i]
		})
	}
	return data;
}



$(document).ready( function() {

	var map = new L.Map('map-canvas').setView([40.734343, -73.990103], 17);
	new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	  { attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', maxZoom: 17 }).addTo(map);


	$.getJSON('static/BIS_combined.json', function( rawData ) {
		
		var data = processBISData( rawData );

		var osmbd = new OSMBDatafier( data );
		osmbd.setupControls('options_container');

		baseMap = new OSMBuildings(map).datafy( osmbd ).loadData();
		
		$('.optionCB').on('change', function( event ) {
			osmbd.updateControls();
			baseMap.refresh( osmbd );
			event.stopPropagation();
		});

		//$('.')

	})




});

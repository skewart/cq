/*
function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(40.728783, -73.990801),
	  zoom: 15
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
*/

/*
var map = new OpenLayers.Map('map-canvas');
map.addControl(new OpenLayers.Control.LayerSwitcher());

var osm = new OpenLayers.Layer.OSM();
map.addLayer(osm);

map.setCenter(
  new OpenLayers.LonLat(40.728783, -73.990801)
    .transform(
      new OpenLayers.Projection('EPSG:4326'),
      map.getProjectionObject()
    ),
  17
);
*/


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

	var map = new L.Map('map-canvas').setView([40.734343, -73.990103], 16);
	new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	  { attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', maxZoom: 17 }).addTo(map);

	

	$.getJSON('static/BIS_combined.json', function( rawData ) {
		
		var data = processBISData( rawData );

		var osmbd = new OSMBDatafier( data );
		Foo = new OSMBuildings(map).datafy( osmbd ).loadData();
		
		$('#options_container').on('click', function() {
			console.log('refreshing...')
			Foo.refresh( osmbd );
		});

	})




});

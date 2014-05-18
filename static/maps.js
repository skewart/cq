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




$(document).ready( function() {

	var map = new L.Map('map-canvas').setView([40.728783, -73.990801], 17);
	new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	  { attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', maxZoom: 17 }).addTo(map);

	var osmbd = new OSMBDatafier()

	Foo = new OSMBuildings(map).datafy( osmbd ).loadData();

	// map.on('click', function(event) {
	// 	console.log( event );
	// })
	


	//Foo.setStyle({color:'#ff0000'});
	$('#options_container').on('click', function() {
		console.log('refreshing...')
		//Foo.setStyle({color:'#ff0000'});
		Foo.refresh( osmbd );
	});


});

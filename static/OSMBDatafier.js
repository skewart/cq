
function OSMBDatafier( data, inputRules ) {

	this.data = data;

	var rules = inputRules || {
		CurrentStatus: {
			NR: 'rgba(210,210,210,0.8)',
			OK: 'rgba(0,220,0,0.9)',
			UN: 'rgba(245,0,0,0.9)',
			PR: 'rgba(30,140,180,0.9)',
			SW: 'rgba(100,45,205,0.9)',
		},
		yearBuilt: function( value ) {
			if ( value > 2000 ) {
				return 'rgba(255,255,0,0.8)'
			} else {
				return 'rgba(140,140,140,0.8)'
			}
		}
	}


	this.setRules = function( newRules ) {
		rules = newRules;
	}


	this.bindData = function( items, data ) {

		// TODO Make this go off of the latlong too, not just NYC BIN or address info...

		data = data || this.data || [
			{ 
				BIN: 2492381,
				latlong: [1,1],  // lat long data
				data: {
					facadeStatus: 'A',
					yearBuilt: 1950
				}
			}
		]

		// iterate over both lists of things, putting them into a hash table keyed
		// by the BIN. 
		var iBin, iiBin, bins = {}
		for ( var i = 0, iLen = items.length; i < iLen; i++ ) {
			iBin = items[i].tags['nycdoitt:bin']
			var ic = i;
			if ( iBin ) {
				iiBin = parseInt( iBin )
			} else {
				iiBin = 'NONE';
			}
			if ( bins[ iiBin ] ) {
				bins[ iiBin ].push( [ items[i], ic ] )
			} else {
				bins[ iiBin ] = [ [ items[i], ic ] ]
			} 
		}		

		for ( var j = 0, dLen = data.length; j < dLen; j++ ) {
			if ( bins[ data[j].BIN ] ) {
				for ( var k = 0; k < bins[ data[j].BIN ].length; k++ ) {
					bins[ data[j].BIN ][k][0].data = data[j].data
				}
			}
		}

		for ( var k = 0, bLen = bins.length; k < bLen; k++ ) {
			for ( var m = 0, tbLen = bins[k].length; m < tbLen; m++ ) {
				var index = bins[k][m][1];
				items[ index ] = bins[k][m][1];
			}
		}

	}


	this.setColors = function( item ) {
    	var color, roofColor, wallColor, altColor;
 		if ( item.data && item.data.CurrentStatus ) {
      		color = rules.CurrentStatus[ item.data.CurrentStatus ]
			item.roofColor = color;
			item.wallColor = color;
			item.altColor = color;
		} else {
			
		}
		item.strokeColor = 'rgb(40,40,40)'
	}

	this.shouldShow = function( item ) {
		return true;
		if ( item.data ) {
			return true;
		}
		return false;
	}

}


/*
	// compares two footprints from OSMB data
	function minFootprint( a, b, offset ) {
		offset = offset || 1   // default to using longitude, because of computer screen aspect ratios 
		var minA = Infinity, minB = Infinity;
		for ( var i = offset; i < a.footprint.length; i+=2 ) {
			if ( a.footprint[i] < minA ) { 
				minA = a.footprint[i];
			}
		}
		for ( var i = offset; i < b.footprint.length; i+=2 ) {
			if ( b.footprint[i] < minB ) { 
				minB = b.footprint[i];
			}
		}
		if ( minA < minB ) { return -1 }
		return 1;
	}

	this.bindData = function( items, data, rules ) {

		data = data || [
			{ 
				latlong: [1,1],  // lat long data
				data: {
					facadeStatus: 'A',
					yearBuilt: 1950
				}
			}
		]

		rules = rules || {
			facadeStatus: {
				A: 'rgba(255,0,0,0.8)',
				B: 'rgba(0,0,255,0.8)'
			},
			yearBuilt: function( value ) {
				if ( value > 2000 ) {
					return 'rgba(255,255,0,0.8)'
				} else {
					return 'rgba(140,140,140,0.8)'
				}
			}
		}

		// do a sweepline, so sort first, then walk across the lists
		items.sort(function(a,b) {
			return minFootprint( a, b );
		})

		data.sort(function(a,b) {
			if ( a.latlong[1] < b.latlong[1] ) {
				return -1;
			}
			return 1;
		})

		for ( var i = 0, dLen = data.length; i < dLen; i++ ) {
			for ( var j =  )
		}

	}

*/
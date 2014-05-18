
function OSMBDatafier( data, inputRules ) {


	var rules = inputRules || {
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


	this.setRules = function( newRules ) {
		rules = newRules;
	}


	this.bindData = function( items, data ) {

		// TODO Make this go off of the latlong too, not just NYC BIN or address info...

		data = data || [
			{ 
				bin: 2492381,
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
			if ( iBin ) {
				iiBin = parseInt( iBin )
				if ( bins[ iiBin ] ) {
					bins[ iiBin ].push( items[i] )
				} else {
					bins[ iiBin ] = [ items[i] ]
				}
			}		
		}		

		for ( var j = 0, dLen = data.length; j < dLen; d++ ) {
			if ( bins[ data[j].bin ] ) {
				bins[ data[j].bin ].data = data[j].data
			}
		}

	}


	this.setColors = function( item ) {
      if ( Math.random() > 0.5 ) {
        item.roofColor = 'rgba(240,0,0,0.9)'
      	item.wallColor = 'rgba(240,0,0,0.9)'
        item.altColor = 'rgba(173,55,47,0.9)'
      	item.strokeColor = 'rgb(40,40,40)'
      } else {
        item.roofColor = 'rgba(0,0,180,0.9)'
        item.wallColor = 'rgba(0,0,180,0.9)'
        item.altColor = 'rgba(12,36,133,0.9)'
        item.strokeColor = 'rgb(40,40,40)'
      }
	}

	//bindData( items, data, rules );

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
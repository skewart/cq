
function OSMBDatafier( data, inputRules ) {

	this.data = data;
	this.controls = {}
	this.controlsContainerID = '';

	var self = this;

	var rules = inputRules || {
		CurrentStatus: {
			NR: 'rgba(210,210,210,0.8)',
			OK: 'rgba(0,220,0,0.9)',
			UN: 'rgba(245,0,0,0.9)',
			PR: 'rgba(30,140,180,0.9)',
			SW: 'rgba(100,45,205,0.9)'
			//Other: '#999999'
		}
	}


	this.setRules = function( newRules ) {
		rules = newRules;
	}

	this.updateControls = function() {
		var elems = document.getElementsByClassName('optionCB');
		for ( var i = 0; i < elems.length; i++ ) {
			var option = elems[i].getAttribute('data-option');
			self.controls.CurrentStatus[ option ] = elems[i].checked
		}
	}

	function makeRow( optionName, value ) {
		var row, cb, swatch, label;
		row = document.createElement('div');
		row.setAttribute('style', 'margin:5px;');
		cb = document.createElement('input');
		cb.setAttribute('type', 'checkbox');
		cb.setAttribute('checked', true );
		cb.setAttribute('style', 'display: inline-block;');
		cb.setAttribute('data-option', optionName );
		cb.setAttribute('class', 'optionCB')
		swatch = document.createElement('div');
		swatch.setAttribute('style', 'background-color:' + value + '; width:20px;height:20px;margin:0px 10px;display:inline-block;' );
		label = document.createElement('div');
		label.innerHTML = optionName;
		label.setAttribute('style', 'display:inline-block;margin-right:10px;');
		row.appendChild( cb );
		row.appendChild( swatch );
		row.appendChild( label );
		return row;
	}


	function addRuleSection( container, rule, ruleName ) {
		var row, cb, swatch, label,
			section = document.createElement('div');
		for ( option in rule ) {
			self.controls[ ruleName ][ option ] = true;
			section.appendChild( makeRow( option, rule[option] ) );
		}
		section.appendChild( makeRow( 'Unknown', '#999999' ) );
		self.controls.CurrentStatus.Unknown = true;
		container.appendChild( section );
	}


	function makeStoriesSlider( container ) {
		self.controls.MinStories = 1;
		var row = document.createElement('table'),
			tr = document.createElement('tr'),
			td = document.createElement('td'),
			bar = document.createElement('div');
			label = document.createElement('div');
		row.setAttribute('style', 'width:120px;height:20px;margin:20px;');
		bar.setAttribute('style', 'width:100px;height:12px;display:inline-block');
		$( bar ).slider({
			min: 1,
			max: 110,
			step: 1,
			value: 1,
			stop: function( event, ui ) {
				self.controls.MinStories = ui.value;
				if (self.map) {
					self.map.refresh();
				}
			},
			slide: function( event, ui ) {
				$("#min_stories").text( ui.value );
			}
		});
		label.innerHTML = 'Min. Stories <span id="min_stories">1</span>';
		row.appendChild( tr );
		tr.appendChild( td );
		td.appendChild( bar );
		td.appendChild( label );
		container.appendChild( row );
	}


	this.setupControls = function( containerID ) {
		this.controlsContainerID = containerID
		var container = document.getElementById( containerID );
		for ( rule in rules ) {
			this.controls[ rule ] = {}
			addRuleSection( container, rules[ rule ], rule );
		}
		makeStoriesSlider( container );
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
 		if ( item.data && item.data.CurrentStatus && self.controls.CurrentStatus[ item.data.CurrentStatus ] ) {
      		color = rules.CurrentStatus[ item.data.CurrentStatus ]
			item.roofColor = color;
			item.wallColor = color;
			item.altColor = color;
			item.strokeColor = 'rgb(40,40,40)'
		} else {
			item.wallColor = 'rgba(153,153,153,0.8)'
			item.roofColor = 'rgba(230,230,230,0.9)'
			item.altColor = 'rgba(190,190,190,0.8)'
			item.strokeColor = 'rgb(120,120,120)'
		}
	}

	function isChecked( value ) {
		return self.controls.CurrentStatus[ value ];
	}

	this.shouldShow = function( item ) {
		var cs, ns;
		if ( item.data ) { 
			cs = item.data.CurrentStatus
			//ns = item.data.NumStories
		} else {
			cs = 'Unknown';//'Other';
			
		}
		if ( item.tags && item.tags.height ) {
			ns = parseFloat( item.tags.height );
		} else {
			ns = 1000;
		}
		return ( isChecked( cs ) && ns >= this.controls.MinStories );
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
'use strict';

let mymap;
let position;
var map;

const initmap = function() {
	console.log('init map');
	console.log(position);
	if (position != null) {
		map = L.map('mapid').setView(position, 13);
		L.tileLayer.provider('Wikimedia').addTo(map);
	}
};

const get_location = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log(pos);
			position = [pos.coords.latitude, pos.coords.longitude];
			console.log('position: ' + position);
			initmap();
		});
	} else {
		postition = [55.824894, 3.249808];
		console.log('Geolocation is not supported by this browser, defaulting to Kortijk');
		initmap();
	}
};

const init = function() {
	console.log('dom geladen');
	// console.log(get_location());
	get_location();
	//initmap();
};
document.addEventListener('DOMContentLoaded', init);

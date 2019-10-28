'use strict';

let mymap;
let position;
var map;
// https://www.n2yo.com/rest/v1/satellite/above/50.82803/3.26487/0/10/0/?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0
let url = 'https://www.n2yo.com/rest/v1/satellite/above/';
let key = '?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0';

let satellite_icon;
const delete_watermark = function() {
	document.querySelector('.leaflet-control-attribution').remove();
};

const show_satellite = async function() {
	let endpoint = `${url}/${position[0]}/${position[1]}/0/10/0/${key}`;
	console.log('getting: ' + endpoint);
	const get = await fetch(endpoint);
	const satellites = await get.json();
	console.log(satellites);
	for (let satellite of satellites.above) {
		console.log(satellite);
		let icon = L.marker([satellite.satlat, satellite.satlng], { icon: satellite_icon }).addTo(map);
		icon.bindPopup(satellite.satname);
	}
};

const initmap = function() {
	console.log('init map');
	console.log(position);
	if (position != null) {
		map = L.map('mapid').setView(position, 13);
		L.tileLayer.provider('Wikimedia').addTo(map);

		satellite_icon = L.icon({
			iconUrl: './img/png/satelietv1.png',
			iconSize: [75, 'auto'], // size of the icon
			//shadowSize: [50, 64], // size of the shadow
			iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
			//shadowAnchor: [4, 62], // the same for the shadow
			popupAnchor: [40, -60] // point from which the popup should open relative to the iconAnchor
			//className: 'c-satellite'
		});

		delete_watermark();
		show_satellite();
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
};
document.addEventListener('DOMContentLoaded', init);

// https://sites.google.com/site/webglearth/ documentation earthgl
// https://www.n2yo.com/api/#above api documentation

'use strict';

let mymap;
let position;
var map;
// https://www.n2yo.com/rest/v1/satellite/above/50.82803/3.26487/0/10/0/?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0
let url = 'https://www.n2yo.com/rest/v1/satellite/above/';
let key = '?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0';

let sat_types = [
	'Brightest',
	'ISS',
	'Weather',
	'NOAA',
	'GOES',
	'Earth resources',
	'Search & rescue',
	'Disaster monitoring',
	'Tracking and Data Relay Satellite System',
	'Geostationary',
	'Intelsat',
	'Gorizont',
	'Raduga',
	'Molniya',
	'Iridium',
	'Orbcomm',
	'Globalstar',
	'Amateur radio',
	'Experimental',
	'Global Positioning System (GPS) Operational',
	'Glonass Operational',
	'Galileo',
	'Satellite-Based Augmentation System',
	'Navy Navigation Satellite System',
	'Russian LEO Navigation',
	'Space & Earth Science',
	'Geodetic',
	'Engineering',
	'Education',
	'Military',
	'Radar Calibration',
	'CubeSats',
	'XM and Sirius',
	'TV',
	'Beidou Navigation System',
	'Yaogan',
	'Westford Needles',
	'Parus',
	'Strela',
	'Gonets',
	'Tsiklon',
	'Tsikada',
	'O3B Networks',
	'Tselina',
	'Celestis',
	'IRNSS',
	'QZSS',
	'Flock',
	'Lemur',
	'Global Positioning System (GPS) Constellation',
	'Glonass Constellation',
	'Starlink'
];
let displayed_sats = new Object();

var earth;
var options;

let satellite_icon;
const delete_watermark = function() {
	//console.log('deleting watermark'); this function deletes the watermark in the corner
	let watermark = document.querySelector('.cesium-credit-textContainer');
	watermark.parentNode.removeChild(watermark);
};

const show_satellite = async function(typeid) {
	//get satellite date from API and puts them into an object
	let endpoint = `${url}/${position[0]}/${position[1]}/0/70/${typeid}/${key}`;
	console.log('getting: ' + endpoint);
	const get = await fetch(endpoint);
	const satellites = await get.json();
	try {
		for (let satellite of satellites.above) {
			// popup width zelf berekenen omdat het een vaste waarde moet krijgen
			let width = 0;
			for (const char of satellite.satname) {
				width += 8;
			}
			//satelliet image en popup met de naam weergeven
			var marker = WE.marker([satellite.satlat, satellite.satlng], './img/svg/satelliet.svg', 80, 80).addTo(earth);
			marker.bindPopup(satellite.satname, { maxWidth: width });
			displayed_sats[typeid].push(marker);
		}
		console.log(displayed_sats);
	} catch (error) {
		console.log('none found');
		//console.log(error);
	}
};

const initmap = function() {
	console.log('init map');
	console.log(position);
	if (position != null) {
		options = {
			atmosphere: true,
			center: position,
			zoom: 7,
			minZoom: 1,
			maxZoom: 5
		};
		earth = new WE.map('js-earth', options);
		// og: http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg
		//https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
		//https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}
		WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', options).addTo(earth);

		delete_watermark();
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
		console.log('position: ' + position);
		initmap();
	}
};

const select_option = function(object) {
	let typeid = sat_types.indexOf(object.id) + 1;
	typeid = typeid.toString();
	//checking if the filter needs to be added or removed
	if (!Object.keys(displayed_sats).includes(typeid)) {
		// not yet selected -> add satellites
		console.log('adding sats');
		displayed_sats[typeid] = [];
		show_satellite(typeid);
	} else {
		// was selected -> remove satellites
		console.log('deleteing sats');
		for (let marker of displayed_sats[typeid]) {
			marker.removeFrom(earth);
			console.log(marker);
		}
		delete displayed_sats[typeid];
		console.log(displayed_sats);
	}
};

const load_types = function() {
	let typelist = document.querySelector('#js-typelist');
	typelist.innerHTML = '';
	for (let sat_name of sat_types) {
		let typeid = sat_types.indexOf(sat_name) + 1;
		// speciaal karacter verwijderen
		// let idname = sat_name.replace('&', '');

		typelist.innerHTML += `
      <li class="c-custom-option">
        <input class="o-hide-accessible c-option--hidden" type="checkbox" id="${sat_name}" value="${typeid}" onclick='select_option(this);' />
        <label class="c-filter-sat" for="${sat_name}">
          <p class="c-filter-satnaam">${sat_name}</p>
          <svg class="c-checkicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.91 54.66">
            <polyline points="2 26.2 25.6 52.66 62.91 2" />
          </svg>
        </label>
      </li>`;
	}
};
const init = function() {
	console.log('dom geladen');
	get_location();
	load_types();
};
document.addEventListener('DOMContentLoaded', init);

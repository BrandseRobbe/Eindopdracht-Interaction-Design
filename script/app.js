// https://sites.google.com/site/webglearth/ documentation earthgl
// https://www.n2yo.com/api/#above api documentation

'use strict';

let mymap;
let position = [50.824644, 3.249585];
var map;
// https://www.n2yo.com/rest/v1/satellite/above/50.82803/3.26487/0/10/0/?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0
let url = 'https://www.n2yo.com/rest/v1/satellite/above/';
let key = '?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0';

let search_radius = 90;
let search_alt = 0;

let all_sats = [
  { Catgory: 'Brightest', Id: '1' },
  { Catgory: 'ISS', Id: '2' },
  { Catgory: 'Weather', Id: '3' },
  { Catgory: 'NOAA', Id: '4' },
  { Catgory: 'GOES', Id: '5' },
  { Catgory: 'Earth resources', Id: '6' },
  { Catgory: 'Search & rescue', Id: '7' },
  { Catgory: 'Disaster monitoring', Id: '8' },
  { Catgory: 'Tracking and Data Relay Satellite System', Id: '9' },
  { Catgory: 'Geostationary', Id: '10' },
  { Catgory: 'Intelsat', Id: '11' },
  { Catgory: 'Gorizont', Id: '12' },
  { Catgory: 'Raduga', Id: '13' },
  { Catgory: 'Molniya', Id: '14' },
  { Catgory: 'Iridium', Id: '15' },
  { Catgory: 'Orbcomm', Id: '16' },
  { Catgory: 'Globalstar', Id: '17' },
  { Catgory: 'Amateur radio', Id: '18' },
  { Catgory: 'Experimental', Id: '19' },
  { Catgory: 'Global Positioning System (GPS) Operational', Id: '20' },
  { Catgory: 'Glonass Operational', Id: '21' },
  { Catgory: 'Galileo', Id: '22' },
  { Catgory: 'Satellite-Based Augmentation System', Id: '23' },
  { Catgory: 'Navy Navigation Satellite System', Id: '24' },
  { Catgory: 'Russian LEO Navigation', Id: '25' },
  { Catgory: 'Space & Earth Science', Id: '26' },
  { Catgory: 'Geodetic', Id: '27' },
  { Catgory: 'Engineering', Id: '28' },
  { Catgory: 'Education', Id: '29' },
  { Catgory: 'Military', Id: '30' },
  { Catgory: 'Radar Calibration', Id: '31' },
  { Catgory: 'CubeSats', Id: '32' },
  { Catgory: 'XM and Sirius', Id: '33' },
  { Catgory: 'TV', Id: '34' },
  { Catgory: 'Beidou Navigation System', Id: '35' },
  { Catgory: 'Yaogan', Id: '36' },
  { Catgory: 'Westford Needles', Id: '37' },
  { Catgory: 'Parus', Id: '38' },
  { Catgory: 'Strela', Id: '39' },
  { Catgory: 'Gonets', Id: '40' },
  { Catgory: 'Tsiklon', Id: '41' },
  { Catgory: 'Tsikada', Id: '42' },
  { Catgory: 'O3B Networks', Id: '43' },
  { Catgory: 'Tselina', Id: '44' },
  { Catgory: 'Celestis', Id: '45' },
  { Catgory: 'IRNSS', Id: '46' },
  { Catgory: 'QZSS', Id: '47' },
  { Catgory: 'Flock', Id: '48' },
  { Catgory: 'Lemur', Id: '49' },
  { Catgory: 'Global Positioning System (GPS) Constellation', Id: '50' },
  { Catgory: 'Glonass Constellation', Id: '51' },
  { Catgory: 'Starlink', Id: '52' }
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

const show_satellite = async function(sat) {
  //get satellite date from API and puts them into an object
  let endpoint = `${url}/${position[0]}/${position[1]}/${search_alt}/${search_radius}/${sat.Id}/${key}`;
  //console.log('getting: ' + endpoint);
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
      displayed_sats[sat.Category].push(marker);
    }
    console.log(displayed_sats);
  } catch (error) {
    console.log('none found');
  }
};

const initmap = function() {
  console.log('init map');
  console.log(position);
  if (position != null) {
    options = {
      atmosphere: true,
      center: position,
      zoom: 2.5,
      minZoom: 1,
      maxZoom: 5
    };
    earth = new WE.map('js-earth', options);
    // og: http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg
    //https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
    //https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}
    WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', options).addTo(earth);

    delete_watermark();
    load_types();
    preselect_categories();
  }
};

const get_location = function() {
  console.log('get position');
  //navigator.geolocation werkt niet tenzij je HTTPS protocol gebruikt -> combell hosting is HTTP
  console.log(navigator.geolocation.getCurrentPosition);
  navigator.geolocation.watchPosition(
    function(pos) {
      position = [pos.coords.latitude, pos.coords.longitude];
      console.log('position: ' + position);
      initmap();
    },
    function(error) {
      position = [50.824644, 3.249585];
      console.log('Geolocation is not supported by this browser, defaulting to Kortijk');
      console.log('position: ' + position);
      initmap();
    }
  );
};

const select_option = function(object) {
  // getting sat values from object (for readability)
  let sat = {
    Category: object.id,
    Id: object.value
  };
  //checking if the filter needs to be added or removed
  if (!Object.keys(displayed_sats).includes(sat.Category)) {
    // not yet selected -> add satellites
    console.log('adding sats');
    displayed_sats[sat.Category] = [];
    show_satellite(sat);
  } else {
    // was selected -> remove satellites
    console.log('deleteing sats');
    for (let marker of displayed_sats[sat.Category]) {
      marker.removeFrom(earth);
      console.log(marker);
    }
    delete displayed_sats[sat.Category];
    console.log(displayed_sats);
  }
};

const load_types = function() {
  console.log('load_types');
  let typelist = document.querySelector('#js-typelist');
  typelist.innerHTML = '';
  for (let sat of all_sats) {
    // speciaal karacter verwijderen
    // let idname = sat_name.replace('&', '');

    typelist.innerHTML += `
      <li class="c-custom-option">
        <input class="o-hide-accessible c-option--hidden" type="checkbox" id="${sat.Catgory}" value="${sat.Id}" onclick='select_option(this);' />
        <label class="c-filter-sat" for="${sat.Catgory}">
          <p class="c-filter-satnaam">${sat.Catgory}</p>
          <svg class="c-checkicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.91 54.66">
            <polyline points="2 26.2 25.6 52.66 62.91 2" />
          </svg>
        </label>
      </li>`;
  }
};

const preselect_categories = function() {
  let preselected = ['Brightest', 'ISS', 'Weather'];

  var event = new Event('input', {
    bubbles: true,
    cancelable: true
  });
  setTimeout(function() {
    for (let category of preselected) {
      setTimeout(document.querySelector(`#${category}`).click(), 500);
    }
  }, 1500);
};

const init = function() {
  console.log('dom geladen');
  get_location();
};
// document.addEventListener('DOMContentLoaded', init);
// document.addEventListener('load', init);
window.onload = function() {
  init();
};

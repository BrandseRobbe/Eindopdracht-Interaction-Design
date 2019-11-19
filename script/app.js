'use strict';

let mymap;
let position;
var map;
// https://www.n2yo.com/rest/v1/satellite/above/50.82803/3.26487/0/10/0/?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0
let url = 'https://www.n2yo.com/rest/v1/satellite/above/';
let key = '?apiKey=6MTZQ7-QW9KS9-X73GC5-47T0';

var earth;
var options;

let satellite_icon;
const delete_watermark = function() {
  //console.log('deleting watermark'); this function deletes the watermark in the corner
  let watermark = document.querySelector('.cesium-credit-textContainer');
  watermark.parentNode.removeChild(watermark);
};

const show_satellite = async function() {
  //get satellite date from API and puts them into an object
  let endpoint = `${url}/${position[0]}/${position[1]}/0/10/0/${key}`;
  console.log('getting: ' + endpoint);
  const get = await fetch(endpoint);
  const satellites = await get.json();

  //console.log(satellites);
  for (let satellite of satellites.above) {
    //console.log(satellite);
    var marker = WE.marker([satellite.satlat, satellite.satlng], './img/svg/satelliet.svg', 80, 80).addTo(earth);
    marker.bindPopup(satellite.satname, { maxWidth: 70 });
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
  //get_location();
};
document.addEventListener('DOMContentLoaded', init);

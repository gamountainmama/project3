// create the map
const myMap = L.map('map', {
    center: [33.77192878612643, -84.39437603097467],
    zoom: 10,
});

// Adding the initial tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

url = 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/67/query?outFields=*&where=1%3D1&f=geojson'

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(myMap);
  });


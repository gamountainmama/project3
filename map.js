// create the map
const myMap = L.map('map', {
    center: [33.77192878612643, -84.39437603097467],
    zoom: 9,
});

// Adding the initial tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// link for county outlines
url = 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/67/query?outFields=*&where=1%3D1&f=geojson'

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(myMap);
  });

metroCounties = []

d3.json(url).then(function(data) {
    features = data.features;
    for (i = 0; i < features.length; i++) {
        properties = features[i].properties;
        county = properties.NAMELSAD10
        metroCounties.push(county)
    }
});

console.log(metroCounties)

// create function to color counties
function countyColors(county) {
    if (county == 'Cherokee County') return '#9e0142'
    else if (county == 'Clayton County') return '#d53e4f'
    else if (county == 'Cobb County') return '#f46d43'
    else if (county == 'DeKalb County') return '#fdae61'
    else if (county == 'Douglas County') return '#fee08b'
    else if (county == 'Fayette County') return '#abdda4'
    else if (county == 'Forsyth County') return '#e6f598'
    else if (county == 'Fulton County') return 'yellow'
    else if (county == 'Gwinnett County') return '#66c2a5'
    else if (county == 'Henry County') return '#3288bd'
    else if (county == 'Rockdale County') return '#5e4fa2'
    else return 'black'
};

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      style: function(feature) {
        return {
            color: countyColors(feature.properties.NAMELSAD10),
            fillColor: countyColors(feature.properties.NAMELSAD10),
            fillOpacity: 0.5,
            weight: 1.5
        };
      }
    }).addTo(myMap);
  });
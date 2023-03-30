// create the map
const myMap = L.map('map', {
    center: [33.77192878612643, -84.39437603097467],
    zoom: 9
});

// Adding the initial tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// link for grocery stores
var link = 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/Grocery_Stores_in_13County_Area/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'

var groceryLayer = [];
var groceryCircles = [];
var martaLayer = [];
var martaCircles = [];
var seatLayer = [];
var seatMarkers = [];
var countyOutlines = [];
var countyLines = [];

// create a circle marker for each grocery store with name and address
d3.json(link).then(function(data) {
  for (i = 0; i < data.features.length; i++) {
    latitude = data.features[i].properties.Latitude,
    longitude = data.features[i].properties.Longitude,
    company = data.features[i].properties.Company,
    address = data.features[i].properties.Address,
    city = data.features[i].properties.City,
    zip = data.features[i].properties.Zip_Code,
    L.circle([latitude, longitude], {radius: 100, color: '#23a7d8', mouseover: `${company}`}).bindPopup(`<center><h2>${company}</h2></center><hr><h3>${address}<br>${city} GA ${zip}</h3>`).addTo(groceryLayer)
}})

// link for MARTA stations
martaLink = 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/17/query?outFields=*&where=1%3D1&f=geojson'

// getting MARTA station data
d3.json(martaLink).then(function(data){
  for (i = 0; i < data.features.length; i++) {
    latitude = data.features[i].geometry.coordinates[1],
    longitude = data.features[i].geometry.coordinates[0],
    code = data.features[i].properties.Stn_Code,
    name = data.features[i].properties.STATION
    L.circle([latitude, longitude], {radius: 200, color:'#b73b77'}).bindPopup(`<center><h2>${name}</h2><h3>MARTA Station ${code}</h3></center>`).addTo(martaLayer)
  }
})

// create JSON for county seats
countySeats = [
  {
  'county': 'Cherokee County',
  'seat': 'Canton',
  'coordinates': [34.23720410316699, -84.49300320996771]
  },
  {
    'county': 'Clayton County',
    'seat': 'Jonesboro',
    'coordinates': [33.521776076746534, -84.35493544105174]
  },
  {
    'county': 'Cobb County',
    'seat': 'Marietta',
    'coordinates': [33.95321208613802, -84.54752441460533]
  },
  {
    'county': 'DeKalb County',
    'seat': 'Decatur',
    'coordinates': [33.774934247861644, -84.2975361778138]
  },
  {
    'county': 'Douglas County',
    'seat': 'Douglasville',
    'coordinates': [33.7502875913945, -84.74887550635073]
  },
  {
    'county': 'Fayette County',
    'seat': 'Fayetteville',
    'coordinates': [33.448373019268196, -84.45614733222322]
  },
  {
    'county': 'Forsyth County',
    'seat': 'Cumming',
    'coordinates': [34.20720224578089, -84.13887486261402]
  },
  {
    'county': 'Fulton County',
    'seat': 'Atlanta',
    'coordinates': [33.74959144315758, -84.39130195165804]
  },
  {
    'county': 'Gwinnett County',
    'seat': 'Lawrenceville',
    'coordinates': [33.955959958257665, -83.98495908732102]
  },
  {
    'county': 'Henry County',
    'seat': 'McDonough',
    'coordinates': [33.447743343564774, -84.15469033231801]
  },
  {
    'county': 'Rockdale County',
    'seat': 'Conyers',
    'coordinates': [33.66770628328603, -84.01510599319802]
  },
]

// create markers for county seats
for (i = 0; i < countySeats.length; i++) {
  seatMarkers.push(L.marker(countySeats[i].coordinates, {title: `${countySeats[i].seat}`}).bindPopup(`<center><h2>${countySeats[i].seat}</h2><h4>is the seat of</h4><h2>${countySeats[i].county}</h2></center>`))
}

// link for county outlines
url = 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/67/query?outFields=*&where=1%3D1&f=geojson'

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    for (i = 0; i < data.features.length; i++) {
      if (data.features[i].properties.NAMELSAD10 == 'Cherokee County') {
        var Cherokee = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Clayton County') {
        var Clayton = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Cobb County') {
        var Cobb = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'DeKalb County') {
        var DeKalb = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Douglas County') {
        var Douglas = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Fayette County') {
        var Fayette = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Forsyth County') {
        var Forsyth = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Fulton County') {
        var Fulton = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};  
      if (data.features[i].properties.NAMELSAD10 == 'Gwinnett County') {
        var Gwinnett = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Henry County') {
        var Henry = L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
      if (data.features[i].properties.NAMELSAD10 == 'Rockdale County') {
        var Rockdale =L.geoJson(data.features[i], {
          style: function(feature) {
            return {
                color: countyColors(feature.properties.NAMELSAD10),
                fillColor: countyColors(feature.properties.NAMELSAD10),
                fillOpacity: 0.3,
                weight: 3
            };
          }
        }).addTo(countyOutlines)};
  }});

// create function to color counties
function countyColors(county) {
    if (county == 'Cherokee County') return '#626542'
    else if (county == 'Clayton County') return '#ab9170'
    else if (county == 'Cobb County') return '#b48a8f'
    else if (county == 'DeKalb County') return '#849894'
    else if (county == 'Douglas County') return '#344b3c'
    else if (county == 'Fayette County') return '#bc7234'
    else if (county == 'Forsyth County') return '#48544c'
    else if (county == 'Fulton County') return '#7865be'
    else if (county == 'Gwinnett County') return '#66c2a5'
    else if (county == 'Henry County') return '#869bbb'
    else if (county == 'Rockdale County') return '#a28c94'
    else return 'black'
};

// Define variables for our tile layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Only one base layer can be shown at a time.
var baseMaps = {
  'Street Map': street,
  Topography: topo
};

// Create layer groups.
var groceryLayer = L.layerGroup(groceryCircles);
var martaLayer = L.layerGroup(martaCircles);
var seatLayer = L.layerGroup(seatMarkers);
var countyOutlines = L.layerGroup(countyLines)

var overlays = {
  'Grocery Stores': groceryLayer,
  'MARTA Stations': martaLayer,
  'County Seats': seatLayer,
  'County Outlines': countyOutlines
};

// Add the layer control to the map.
L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(myMap);
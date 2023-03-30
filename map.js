// create the map
const myMap = L.map('map', {
    center: [33.77192878612643, -84.39437603097467],
    zoom: 9,
});

// Adding the initial tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// link for grocery stores
var link = 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/Grocery_Stores_in_13County_Area/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'

var groceryLayer = []

// create a circle marker for each grocery store with name and address
d3.json(link).then(function(data) {
  for (i = 0; i < data.features.length; i++) {
    latitude = data.features[i].properties.Latitude,
    longitude = data.features[i].properties.Longitude,
    company = data.features[i].properties.Company,
    address = data.features[i].properties.Address,
    city = data.features[i].properties.City,
    zip = data.features[i].properties.Zip_Code,
    L.circle([latitude, longitude], {radius: 100, color: 'blue'}).bindPopup(`<h2>${company}</h2><hr><h3>${address}<br>${city} GA ${zip}</h3>`).addTo(myMap)
}})

// link for county outlines
url = 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/67/query?outFields=*&where=1%3D1&f=geojson'

// // Getting our GeoJSON data
// d3.json(url).then(function(data) {
//     // Creating a GeoJSON layer with the retrieved data
//     L.geoJson(data).addTo(myMap);
//   });

// metroCounties = []

// d3.json(url).then(function(data) {
//     features = data.features;
//     for (i = 0; i < features.length; i++) {
//         properties = features[i].properties;
//         county = properties.NAMELSAD10
//         metroCounties.push(county)
//     }
// });

// console.log(metroCounties)

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

for (i = 0; i < countySeats.length; i++) {
  L.marker(countySeats[i].coordinates, {title: `${countySeats[i].seat}`}).bindPopup(`<center><h2>${countySeats[i].seat}</h2><h4>is the seat of</h4><h2>${countySeats[i].county}</h2></center>`).addTo(myMap)
}

console.log(countySeats)

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

// create function to include counties
function countyMetro(county) {
  if (county == 'Cherokee County') return 'metro'
  else if (county == 'Clayton County') return 'metro'
  else if (county == 'Cobb County') return 'metro'
  else if (county == 'DeKalb County') return 'metro'
  else if (county == 'Douglas County') return 'metro'
  else if (county == 'Fayette County') return 'metro'
  else if (county == 'Forsyth County') return 'metro'
  else if (county == 'Fulton County') return 'metro'
  else if (county == 'Gwinnett County') return 'metro'
  else if (county == 'Henry County') return 'metro'
  else if (county == 'Rockdale County') return 'metro'
  else return 'n/a'
};

d3.json(url).then(function(data) {
  for (i = 0; i < data.features; i++) {
  console.log(data.features[i].properties.NAMELSAD10)
}})



// // Getting our GeoJSON data
// d3.json(url).then(function(data) {
//     // Creating a GeoJSON layer with the retrieved data
//     L.geoJson(data, {
//       style: function(feature) {
//         return {
//             color: countyColors(feature.properties.NAMELSAD10),
//             fillColor: countyColors(feature.properties.NAMELSAD10),
//             fillOpacity: 0.2,
//             weight: 2.5
//         };
//       }
//     }).addTo(myMap);
//   });

// link to MARTA stations
martaLink = 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/17/query?outFields=*&where=1%3D1&f=geojson'

// getting MARTA station data
d3.json(martaLink).then(function(data){
  for (i = 0; i < data.features.length; i++) {
    latitude = data.features[i].geometry.coordinates[1],
    longitude = data.features[i].geometry.coordinates[0],
    code = data.features[i].properties.Stn_Code,
    name = data.features[i].properties.STATION
    L.circle([latitude, longitude], {radius: 200, color:'red'}).bindPopup(`<h2>${name} MARTA Station ${code}<h2>`).addTo(myMap)
  }
})

// d3.json(link).then(function(data) {
//   for (i = 0; i < data.features.length; i++) {
//     latitude = data.features[i].properties.Latitude,
//     longitude = data.features[i].properties.Longitude,
//     company = data.features[i].properties.Company,
//     address = data.features[i].properties.Address,
//     city = data.features[i].properties.City,
//     zip = data.features[i].properties.Zip_Code,
//     L.circle([latitude, longitude]).bindPopup(`<h2>${company}</h2><hr><h3>${address}<br>${city} GA ${zip}</h3>`).addTo(myMap)
// }})



// var borderLayer = []
// var seatLayer = []
// var martaLayer = []
// var groceryLayer = []

// // Create an overlay object.
// var overlays = {
//   'County Borders': borderLayer,
//   'County Seats': seatLayer,
//   'MARTA Stations': martaLayer,
//   'Grocery Stores': groceryLayer
// };

// L.control.layers(overlays).addTo(myMap)
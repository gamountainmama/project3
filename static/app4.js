/*
Frances Jay, John Kiersznowski, Sea Gun Lee, Carol Love
GT Project 3
Interactive Map of Atlanta
*/
//initialize
function init(){
    //dropdown menu
    var countyList=[];
    console.log(`counties: ${JSON.stringify(counties)}`);
    for (i=0; i < counties.length; i++){
        countyList.push(counties[i].name);
    }
    console.log(`all counties: ${countyList}`);
    d3.select("#selCounty")
        .selectAll('myOptions')
            .data(countyList)
        .enter()
            .append('option')
        .text(function (d) {return d; })
        .attr("value", function (d) {return d; });
    var initCounty = countyList[0];
    
    // load in our data from the data route in flaskapp.py
    d3.json('/data').then(results=>{
        console.log(JSON.stringify(results))
        
        // set up the county stats card with the first county in our list
        countyStats(initCounty, results);
    })
};

//update plots when dropdown selection changes
function optionChanged() {
    //select the dropdown item first before setting the value
    let dropdown = d3.select("#selCounty");
    let county = dropdown.property("value");

    // load in our data from the data route in flaskapp.py
    d3.json('/data').then(results=>{
        
        // set up the county stats card with the first county in our list
        countyStats(county, results);
    }) 
};

/* this function changes what is displayed within the statistcis card on the site
We're not making any updates with Plotly; it's simply updating a list of attributes about
the county in particular that we need to update. */
function countyStats(county, data) {
    var countyStatsText = d3.select("#county-statistics")

    console.log(data["data"])

    var filtered=[];
    
    for (i=0; i<data["data"].length; i++){
        if ((data["data"][i]["Name"]).toLowerCase() == county.toLowerCase()){
            filtered[county] = data["data"][i]
        }
    }

    console.log(filtered)

    countyStatsText.selectAll('p').remove();
    for (const [key,value] of Object.entries(filtered[county])) {
        countyStatsText.append("p").text(`${key}: ${value}`)
    }

    // update header
    var newHeader = `${county} County Statistics`
    document.getElementById("card-title").innerText = newHeader;
   
    newColor = countyColors(county);
    var statsCard = document.getElementById("stats-card");
    statsCard.style.backgroundColor = newColor;
};

// create function to color counties
function countyColors(county) {
    if (county.toLowerCase().includes('cherokee')) return '#626542'
    else if (county.toLowerCase().includes('clayton')) return '#ab9170'
    else if (county.toLowerCase().includes('cobb')) return '#b48a8f'
    else if (county.toLowerCase().includes('dekalb')) return '#849894'
    else if (county.toLowerCase().includes('douglas')) return '#344b3c'
    else if (county.toLowerCase().includes('fayette')) return '#bc7234'
    else if (county.toLowerCase().includes('forsyth')) return '#48544c'
    else if (county.toLowerCase().includes('fulton')) return '#7865be'
    else if (county.toLowerCase().includes('gwinnett')) return '#66c2a5'
    else if (county.toLowerCase().includes('henry')) return '#869bbb'
    else if (county.toLowerCase().includes('rockdale')) return '#a28c94'
    else return 'black'
};

init();

// run AOS script to animate
/* AOS.init({
    duration: 1200,
  }) */
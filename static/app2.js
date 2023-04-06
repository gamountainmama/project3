/*
Frances Jay, John Kiersznowski, Sea Gun Lee, Carol Love
GT Project 3
Interactive Map of Atlanta
*/

import AOS from 'aos';

//initialize
function init(){
    d3.json('/data').then(data=>{
        console.log(`getCountyData: ${JSON.stringify(data)}`)
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

        
        countyStats(initCounty);
    })
};

//update plots when dropdown selection changes
function optionChanged() {
    //select the dropdown item first before setting the value
    let dropdown = d3.select("#selCounty");
    let county = dropdown.property("value");

    countyStats(county);    
};

/* this function changes what is displayed within the statistcis card on the site
We're not making any updates with Plotly; it's simply updating a list of attributes about
the county in particular that we need to update. */
function countyStats(county) {
    var countyStatsText = d3.select("#county-statistics")

    var countyFiltered = data.filter(row => row['Name'].toLowerCase().includes(county.toLowerCase()));
    countyStatsText.selectAll('p').remove();
    countyFiltered.forEach(row => {
        for (const [key,value] of Object.entries(row)) {
            countyStatsText.append("p").text(`${key}: ${value}`);
        }
    });

    // update header
    console.log("update header piece")
    var countyStats = d3.select("stats-card")
    countyStats.style.backgroundColor = countyColors(county);
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
AOS.init({
    duration: 1200,
  })
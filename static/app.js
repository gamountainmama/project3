/*
Frances Jay, John Kiersznowski, Sea Gun Lee, Carol Love
GT Project 3
Interactive Map of Atlanta
*/

//const url="https://raw.githubusercontent.com/gamountainmama/project3/frances/counties.csv"

//initialize
function init(){
    var variablesList={};
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
    
    //connect to database - rent.csv for now
    rentDict=[];
    tempDict={};
    d3.csv("Resources/rent.csv").then(function(rentData) {
        var rentDict = setRentDict(rentData);
        // set the variables we need for all of our charts
        variablesList = setVariables(rentDict, initCounty);

        // initial BAR CHART set up
        var chartdata = barChart(variablesList);
        var layout = {
            title: `Average Rent per Apartment Type in ${initCounty} County`,
            xaxis: {
                title: {
                    text: "Number of Bedrooms"
                }
            },
            yaxis: {
                title: {
                    text: "Average Rent in US Dollars ($)"
                }
            }
        }
        Plotly.newPlot("bar",chartdata,layout);
        
        // initial BUBBLE CHART
        var chartdata = bubbleChart();
        var layout = {
            title: "Bubble Chart",
            xaxis: {
                title: {
                    text: "Population"
                }
            },
            yaxis: {
                title: {
                    text: "Y Values"
                }
            }
        }
        countyStats(initCounty);
    })
};

//update plots when dropdown selection changes
function optionChanged() {
    //select the dropdown item first before setting the value
    let dropdown = d3.select("#selCounty");
    let county = dropdown.property("value");

    buildPlots(county);
    countyStats(county);
};

// setting the list of dictionaries used in the rent bar chart
// all the numeric values read in as "$### ", so we need to clean that up and make them actually numeric
function setRentDict(rentData) {
    for (var i=0; i < rentData.length; i++) {
        tempDict = {
            "county":rentData[i]["County"],
            "studio":+rentData[i]["Studio"].replace(/\$/g,'').replace(/\,/g,''),
            "1 bedroom":+rentData[i]["1 BR"].replace(/\$/g,'').replace(/\,/g,''),
            "2 bedroom":+rentData[i]["2 BR"].replace(/\$/g,'').replace(/\,/g,''),
            "3 bedroom":+rentData[i]["3 BR"].replace(/\$/g,'').replace(/\,/g,''),
            "4 bedroom":+rentData[i]["4 BR"].replace(/\$/g,'').replace(/\,/g,''),
            "population":+rentData[i]["Est. Population"].replace(/\,/g,'')
        }
        rentDict.push(tempDict);
    }
    return rentDict;
};

/* set the important variables for all of our charts.
varList: {
    "county": selected county,
    "barValues": {
        "Studio":average rent of studio apt in county
        "1 Bedroom":average rent of 1 bed apt in county
        "2 Bedroom":average rent of 2 bed apt in county
        "3 Bedroom":average rent of 3 bed apt in county
        "4 Bedroom":average rent of 4 bed apt in county
    }
} */
function setVariables(data,countyOfInterest) {
    // set up the variable list- right now, interested only in rent
    var varList = {
        "county":countyOfInterest,
        "barValues": {
            "Studio":0,
            "1 Bedroom":0,
            "2 Bedrooms":0,
            "3 Bedrooms":0,
            "4 Bedrooms":0
        },
    };

    console.log(JSON.stringify(data));
    var dataCountyFilter = data.filter(row => row["county"].includes(countyOfInterest));

    // the dataset is filtering on rows that include the county name, so there may be more than one (e.g. Cherokee County in the Rent Dataset = Cherokee County Metro)
    for (var i=0; i < dataCountyFilter.length; i++) {
        varList["barValues"]["Studio"] += dataCountyFilter[i]["studio"];
        varList["barValues"]["1 Bedroom"] += dataCountyFilter[i]["1 bedroom"];
        varList["barValues"]["2 Bedrooms"] += dataCountyFilter[i]["2 bedroom"];
        varList["barValues"]["3 Bedrooms"] += dataCountyFilter[i]["3 bedroom"];
        varList["barValues"]["4 Bedrooms"] += dataCountyFilter[i]["4 bedroom"];
    }

    // average out the rent for each type of rental in the county in case there are multiple
    varList["barValues"]["Studio"] = varList["barValues"]["Studio"] / dataCountyFilter.length;
    varList["barValues"]["1 Bedroom"] = varList["barValues"]["1 Bedroom"] / dataCountyFilter.length;
    varList["barValues"]["2 Bedrooms"] = varList["barValues"]["2 Bedrooms"] / dataCountyFilter.length;
    varList["barValues"]["3 Bedrooms"] = varList["barValues"]["3 Bedrooms"] / dataCountyFilter.length;
    varList["barValues"]["4 Bedrooms"] = varList["barValues"]["4 Bedrooms"] / dataCountyFilter.length;

    return varList;
};

// set the list of variables Plotly uses to create our bar chart
function barChart(varList){
    console.log(`barChart county: ${JSON.stringify(varList["county"])}`)
    var xValue = Object.keys(varList["barValues"]);
    var yValue = Object.values(varList["barValues"]);
    var barchart = {
        x:xValue,
        y:yValue,
        type:"bar",
        title:`Average Rent for Apt Type in ${varList["county"]} County`
    }
    var bardata = [barchart];
    return bardata;
};

// similar to barChart, we set a list of variables Plotly will use for the bubble chart
function bubbleChart(xValue,yValue,labels){
    var bubblechart = {
        x:xValue,
        y:yValue,
        mode:"markers",
        text:labels,
        marker: {
            size:yValue,
            color:xValue,
            colorscale:"Picnic"
        }
    }
    var bubbles = [bubblechart];
    return bubbles;
};

/* after the dropdown selection changes, we'll call this function
to make the actual updates to our charts. we'll need to reset the variables
list using the setVariables function and then make a dictionary of things
to update within the chart itself, rather than creating a whole new plot
(i.e. using Plotly.restyle instead of Plotly.newPlot) */
function buildPlots(county) {
    var variablesList = {};
    d3.csv("Resources/rent.csv").then(function(rentData) {
        var rentDict = setRentDict(rentData);
        variablesList = setVariables(rentDict, county);

        var chartdata = barChart(variablesList);
        console.log(`buildPlots color: ${countyColors(county)}`)
        var updateData = {
            "x":[chartdata[0].x],
            "y":[chartdata[0].y],
            "marker.color":[countyColors(county)]
        }
        var updateLayout = {
            "title":chartdata[0].title,
            
        }
        console.log(`updateData: ${JSON.stringify(updateData)}`)
        Plotly.update("bar",updateData,updateLayout)

        chartdata = bubbleChart(xValue,yValue,labels)
        var updateData = {
            "x":[chartdata[0].x],
            "y":[chartdata[0].y],
            "text":chartdata[0].text,
            "marker.size": [chartdata[0].marker.size],
            "marker.color": [chartdata[0].marker.color]
        }
        Plotly.restyle("bubble",updateData);
    });
};

/* this function changes what is displayed within the statistcis card on the site
We're not making any updates with Plotly; it's simply updating a list of attributes about
the county in particular that we need to update. */
function countyStats(county) {
    var countyStatsText = d3.select("#county-statistics")
    d3.csv("Resources/atl_data.csv").then(function(data) {
        var statsFiltered = data.filter(row => row["County"].toLowerCase().includes(county.toLowerCase()));

        //need to clear what's in there currently to make room for new stuff
        countyStatsText.selectAll("p").remove();
        // for each row (should only be 1) and for each value in the list, print it to the paragraph element
        statsFiltered.forEach((row) => {
            for (const [key,value] of Object.entries(row)) {
                countyStatsText.append("p").text(`${key}: ${value}`);
            };
        })
    })

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

//need to run init function to start
init();

// run AOS script to animate
AOS.init({
    duration: 1200,
  })
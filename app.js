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
    let dropdown = d3.select("#selCounties");
    let county = dropdown.property("value");

    buildPlots(county);
};

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

function barChart(varList){
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

function buildPlots(county) {
    var variablesList = {};
    d3.csv(url).then(function (data){
        variablesList = setVariables(data, county);

        var chartdata = barChart(xValue,yValue);
        var updateData = {
            "x":[chartdata[0].x],
            "y":[chartdata[0].y],
            "text":chartdata[0].text
        }
        Plotly.restyle("bar",updateData)

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
    var statsCard = d3.select("#county-statistics")
    d3.csv("Resources/atl_data.csv").then(function(data) {
        console.log(county)
        var statsFiltered = data.filter(row => row["County"].toLowerCase().includes(county.toLowerCase()));
        console.log(`countystats: ${JSON.stringify(statsFiltered)}`);

        //need to clear what's in there currently to make room for new stuff
        statsCard.selectAll("p").remove();
        // for each row (should only be 1) and for each value in the list, print it to the paragraph element
        statsFiltered.forEach((row) => {
            for (const [key,value] of Object.entries(row)) {
                statsCard.append("p").text(`${key}: ${value}`);
            };
        })
    })
};

//need to run init function to start
init();
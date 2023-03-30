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
    var rentDict=[];
    d3.csv("Resources/rent.csv", function(rentData) {
        for (var i=0; i < rentData.length; i++) {
            var tempDict = {
                "county":rentData[i].County,
                "studio":rentData[i].Studio,
                "1 bedroom":rentData[i]["1 BR"],
                "2 bedroom":rentData[i]["2 BR"],
                "3 bedroom":rentData[i]["3 BR"],
                "4 bedroom":rentData[i]["4 BR"],
                "population":rentData[i]["Est. Population"]
            }
            rentDict.append(tempDict);
            console.log(rentDict[i]);
        }
    });

    //initial bar set up
    variablesList = setVariables(initCounty);
    var chartdata = barChart();
    Plotly.newPlot("bar",chartdata);
    
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
    Plotly.newPlot("bubble",chartdata,layout);

    // countyStats(initCounty);
};

//update plots when dropdown selection changes
function optionChanged() {
    //select the dropdown item first before setting the value
    let dropdown = d3.select("#selCounties");
    let county = dropdown.property("value");

    buildPlots(county);
};

function setVariables(county) {
    var varList = {};
        let countySliced = county;
    return varList;
};

function barChart(xValue,yValue){
    var barchart = {
        x:xValue,
        y:yValue,
        type:"bar"
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

// /* this function changes what is displayed within the statistcis card on the site
// We're not making any updates with Plotly; it's simply updating a list of attributes about
// the county in particular that we need to update. */
// function countyStats(county) {
//     var statsCard = d3.select("#county-statistics")
//     d3.json(url).then(function(data){
//         var statsData = data.metadata; // all metadata available in samples.json
//         var statsFiltered = statsData.filter(row => row.id==sample)

//         //need to clear what's in there currently to make room for new stuff
//         statsCard.selectAll("p").remove();
//         // for each row (should only be 1) and for each value in the list, print it to the paragraph element
//         statsFiltered.forEach((row) => {
//             for (const [key,value] of Object.entries(row)) {
//                 statsCard.append("p").text(`${key}: ${value}`);
//             };
//         })
//     })
// };

//need to run init function to start
init();
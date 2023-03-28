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

//need to run init function to start
init();
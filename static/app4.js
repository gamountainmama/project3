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

        var varList = setVariables(initCounty,results)
        var chartdata = eduChartList(varList["school"],varList["sat"],varList["act"],varList["county"],varList["color"],varList["border"])
        var layout = {
            title: "Number of Public Schools vs Standardized Test Scores",
            xaxis: {
                title: {
                    text: "Number of Public Schools"
                },
                showgrid:true,
            },
            yaxis: {
                title: {
                    text: "Average SAT Score"
                }
            },
            grid: {
                columns:5
            }
        }
        Plotly.newPlot("education",chartdata,layout);
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
        educationChartUpdate(county,results);
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

//set Variables
function setVariables(activeCounty, data){
    var countyList = [];
    var schoolList = [];
    var satList = [];
    var actList = [];
    var colorList=[];
    var activeBorder=[];

    for (i=0; i<data["data"].length; i++){
        countyList[i] = data["data"][i]["Name"];
        schoolList[i]= data["data"][i]["Public Schools Count (2020-21)"];
        satList[i] = data["data"][i]["Average SAT Score, Combined (2020-21)"];
        actList[i] = data["data"][i]["ACT Composite Score (2019-20)"];
        colorList[i] = countyColors(data["data"][i]["Name"]);
        if (data["data"][i]["Name"].toLowerCase() == activeCounty.toLowerCase()){
            activeBorder[i]=2
        }
        else {
            activeBorder[i]=0
        }
    };

    var varList = {
        "county":countyList,
        "school":schoolList,
        "sat":satList,
        "act":actList,
        "color":colorList,
        "border":activeBorder
    };
    return varList;
};

// set list of variables for Plotly
function eduChartList(schoolList,satList,actList,countyList,colorList,activeBorder){
    var labels = []
    for (i=0; i < countyList.length; i++){
        labels[i] = `${countyList[i]}<br>ACT Score: ${actList[i]}`
    }
    var chartElement = {
        x:schoolList,
        y:satList,
        mode:"markers",
        text:labels,
        marker: {
            size: actList,
            color:colorList,
            symbol:"circle",
            line: {
                color:"red",
                width:activeBorder
            }
        }
    }
    var chartdata = [chartElement];
    return chartdata;
};

// create function for populating the chart
function educationChartUpdate(activeCounty, data){
    var varList = setVariables(activeCounty,data);
    var chartdata = eduChartList(varList["school"],varList["sat"],varList["act"],varList["county"],varList["color"],varList["border"])
    var updateData = {
        "x":[chartdata[0].x],
        "y":[chartdata[0].y],
        "marker.line.width":[chartdata[0].marker.line.width]
    }
    Plotly.restyle("education",updateData);
};

init();
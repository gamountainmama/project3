var data = d3.csv("Resources/atl_data.csv").then(function(data) {
    var meanTravel = [];
    for (i=0;i<data.length;i++) {
    meanTravel.push(data[i]["2016-2020 Mean Travel Time in Minutes"])
    }
    console.log(meanTravel);
    medIncome = [];
    for (i=0;i<data.length;i++) {
    medIncome.push(data[i]["2020 Model-Based Estimate of Median Household Income, Dollars"])
    }
    console.log(medIncome);

    // define the data for the bubble chart
    var bubble = [{
        x: medIncome,
        y: meanTravel,
        mode: 'markers',
        marker: {size: meanTravel, color: medIncome},
        }];
    
    var bubbleLayout = {
        xaxis: {title: 'Median Income'},
        yaxis: {title: 'Mean Commute Time'}
        };
    
    // plot the bubble chart
    Plotly.newPlot('bubble', bubble, bubbleLayout);
});
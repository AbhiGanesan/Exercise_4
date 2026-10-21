var svg = d3.select(".histogram")

// This is the data the histogram will use to create bars, starts empty and is recalculated each time we move the slider
var histogramData = []

// Here we create the slider's scale and initial value
var binSliderScale = d3.scaleLinear().rangeRound([2, 30])
var binSliderValue = 2

document.getElementById("binSlider").oninput = function() {
    // refresh the slider's value (+ converts the string to a number)
    binSliderValue = +this.value;
    // re-form the histogram bins based on the slider's value
    formHistogramBins(binSliderValue, minRevenue, maxRevenue)
    // re-form the histogram's X axis based on the number of bins
    createXAxis()
    // re-form the histogram's Y axis based on the counts we get
    createYAxis()
    // re-draw both axes
    d3.select(".y-axis-hist").call(yHistAxis);
    d3.select(".x-axis-hist").call(xHistAxis);
    // delete the old bars and form new ones
    var svg = d3.select(".histBars").remove()
    createBars()
}

// variables that axis and bar creation functions will use
var xHistScale;
var xHistAxis;
var yHistScale
var yHistAxis;

// initialize the histogram based on current slider values (order matters here)
formHistogramBins(binSliderValue, minRevenue, maxRevenue)
createXAxis()
createYAxis()
createBars()

// Label the X-axis
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width*.45)
    .attr("y", height-20)
    .attr("dy", ".75em")
    .text("Revenue (in Thousands of USD)");

// Label the Y-axis
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -height*.25)
    .attr("y", 0)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Count of stores achieving revenue in one year");

// render the x axis
svg.append('g')
    .attr('class', 'x-axis-hist')
    .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xHistAxis)

// render the Y axis
svg.append('g')
    .attr('class', 'y-axis-hist')
    .attr('transform', `translate(${ margin.left },0)`)
    .call(yHistAxis)

// Create the Y-axis
function createYAxis() {
    var yMax = d3.max(histogramData, d => d.count)
    yHistScale = d3.scaleLinear()
        .domain([ 0, yMax ])
        .range([ height - margin.bottom, margin.top ])
    yHistAxis = d3.axisLeft(yHistScale)
        .tickSizeOuter(0)
}

// Create the X-axis
function createXAxis() {
    var xHistDomain = histogramData.map(d => d.rangeHigh)
    xHistScale = d3.scaleBand()
        .domain( xHistDomain )
        .range([ margin.left, width - margin.right - margin.left ])
        .padding(0)
    xHistAxis = d3.axisBottom(xHistScale)
        .tickSizeOuter(0)
}

// create histogram bins based on pre-computed min/max values and a number of bins to form
function formHistogramBins(numBins, min, max) {
    // begin by clearing out the old data
    histogramData = []
    // compute a bucketsize based on the range
    range = max - min
    bucketSize = range/(numBins)
    // form empty bins with bucketsize and empty counts
    for(b = 0; b < numBins; ++b)
        histogramData.push({rangeHigh: (min+b*bucketSize).toFixed(0) + "+", count : 0})
    
    // go through each revenue record and figure out which bucket's count to increment
    for(j = 0; j < rawData.length; ++j)
    {
        var revenueHere = parseFloat(rawData[j].Revenue)
        // determine the bucket this revenue lives in
        var bucket = parseInt((revenueHere - min)/bucketSize)
        // handle the case that the max lands ON the last fencepost by moving it back one
        if(bucket == numBins)
            bucket -= 1
        // handle the case that the max lands PAST the last fencepost by moving it back TWO (numeric precision can cause this)
        if(bucket == numBins + 1)
            bucket -= 2
        
        // finally, update the count
        histogramData[bucket].count += 1
    }
}

function createBars(numBins, min, max) {
    // Create bars, grouped under "histBars" so the slider can remove them
    d3.select("#svgHistogram").append("g")
        .attr("class", "histBars")
        .selectAll(".histBar")
        .data(histogramData)
        .enter()
        .append("rect")
        .attr("class", "histBar")
        .attr("x", d => xHistScale(d.rangeHigh))
        .attr("y", d => yHistScale(d.count))
        .attr("width", xHistScale.bandwidth())
        .attr("height", d => height - margin.bottom - yHistScale(d.count))
        .attr("fill", "steelblue")
        .attr("stroke", "white")

    // Mouseover events for hist bars
    d3.selectAll(".histBar")
        .on("mouseover", function(event)
        {
            d3.select(this).attr("fill", "red")
        })
        .on("mouseout",function()
        {
            d3.select(this).attr("fill", "steelblue")
        });
}
var svg = d3.selectAll("#svgYear")

// Label the X-axis
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width*.45)
    .attr("y", height-20)
    .attr("dy", ".75em")
    .text("Year");

// Label the Y-axis
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -height*.25)
    .attr("y", 0)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Revenue (in Thousands of USD)");

// Create the X-axis
var xYearDomain = yearData.map(d => d.Year)
var xYearScale = d3.scaleBand()
    .domain( xYearDomain )
    .range([ margin.left, width - margin.right - margin.left ])
    .padding(0.5)
var xYearAxis = d3.axisBottom(xYearScale)
    .tickSizeOuter(0)

// render the x axis
svg.append('g')
    .attr('class', 'x-axis-years')
    .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xYearAxis)

// Create the Y-axis
var yMax = d3.max(yearData, d => d.Revenue)
var yScale = d3.scaleLinear()
    .domain([ 0, yMax ])
    .range([ height - margin.bottom, margin.top ])
var yAxis = d3.axisLeft(yScale)
    .tickSizeOuter(0)

// render the Y axis
svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${ margin.left },0)`)
    .call(yAxis)

// Create bars
//FIXME your code here. Be sure to class each bar as "yearBar"
//  Consult your Day 5 from Exercise 3 for inspiration
// Also be aware of the datum() function for the tooltip on mouseover
svg.selectAll(".yearBar")
    .data(yearData)
    .enter()
    .append("rect")
    .attr("class", "yearBar")
    .attr("x", d => xYearScale(d.Year))
    .attr("y", d => yScale(d.Revenue))
    .attr("width", xYearScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.Revenue))
    .attr("fill", "steelblue")


// Mouseover events for year bars
d3.selectAll(".yearBar")
    .on("mouseover", function(event)
    {
        var d = d3.select(this).datum()
        d3.select(this).attr("fill", "red")
        // tooltip showing the year and revenue
        d3.select("#svgYear").append("text")
            .attr("class", "yearTip")
            .attr("x", xYearScale(d.Year) + xYearScale.bandwidth() / 2)
            .attr("y", yScale(d.Revenue) - 5)
            .attr("text-anchor", "middle")
            .text(d.Year + ": " + d.Revenue.toFixed(1))
    })
    .on("mouseout", function()
    {
        d3.select(this).attr("fill", "steelblue")
        d3.selectAll(".yearTip").remove()
    });

// Helper function to keep the click handler shorter
function updateYearAxis() {
    // rebuild the scale
    var x0 = xYearScale.domain(yearData.map(function (d) {return d.Year;}));
    // move the bars around based on new scale
    d3.selectAll(".yearBar")
        .attr("x", function(d) {return x0(d.Year);});
    // render axis using new scale
    d3.select(".x-axis-years").call(xYearAxis);
}

// click event for the year chart
var sortYearDescending = true
var sortYearChartByRevenueDescending = true
d3.select("#svgYear")
    .on("mousedown", function(event)
    {
        var mouseCoords = d3.pointer(event)
        if (mouseCoords[0] < margin.left)
        {
            // clicked the Y axis: sort by revenue
            yearData.sort((a, b) => sortYearChartByRevenueDescending
                ? b.Revenue - a.Revenue : a.Revenue - b.Revenue)
            sortYearChartByRevenueDescending = !sortYearChartByRevenueDescending
            updateYearAxis()
        }
        else if (mouseCoords[1] > height - margin.bottom)
        {
            // clicked the X axis: sort by year
            yearData.sort((a, b) => sortYearDescending
                ? b.Year - a.Year : a.Year - b.Year)
            sortYearDescending = !sortYearDescending
            updateYearAxis()
        }
    });

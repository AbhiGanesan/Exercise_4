var svgStore = d3.select("#svgStore")

// Label the X-axis
svgStore.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width*.45)
    .attr("y", height-20)
    .attr("dy", ".75em")
    .text("Store");

// Label the Y-axis
svgStore.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -height*.25)
    .attr("y", 0)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Revenue (in Thousands of USD)");

// Create the X-axis
var xStoreDomain = storeData.map(d => d.Store)
var xStoreScale = d3.scaleBand()
    .domain( xStoreDomain )
    .range([ margin.left, width - margin.right - margin.left ])
    .padding(0.5)
var xStoreAxis = d3.axisBottom(xStoreScale)
    .tickSizeOuter(0)

// render the x axis
svgStore.append('g')
    .attr('class', 'x-axis-stores')
    .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xStoreAxis)

// Create the Y-axis
var yStoreMax = d3.max(storeData, d => d.Revenue)
var yStoreScale = d3.scaleLinear()
    .domain([ 0, yStoreMax ])
    .range([ height - margin.bottom, margin.top ])
var yStoreAxis = d3.axisLeft(yStoreScale)
    .tickSizeOuter(0)

// render the Y axis
svgStore.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${ margin.left },0)`)
    .call(yStoreAxis)

// Create bars
svgStore.selectAll(".storeBar")
    .data(storeData)
    .enter()
    .append("rect")
    .attr("class", "storeBar")
    .attr("x", d => xStoreScale(d.Store))
    .attr("y", d => yStoreScale(d.Revenue))
    .attr("width", xStoreScale.bandwidth())
    .attr("height", d => height - margin.bottom - yStoreScale(d.Revenue))
    .attr("fill", "steelblue")
    
// Mouseover/out events for store bars
d3.selectAll(".storeBar").on("mouseover", function(event)
{
    var d = d3.select(this).datum()
    d3.select(this).attr("fill", "red")
    // tooltip showing the store and revenue
    svgStore.append("text")
        .attr("class", "storeTip")
        .attr("x", xStoreScale(d.Store) + xStoreScale.bandwidth() / 2)
        .attr("y", yStoreScale(d.Revenue) - 5)
        .attr("text-anchor", "middle")
        .text(d.Store + ": " + d.Revenue.toFixed(1))
})
.on("mouseout",function(event)
{
    d3.select(this).attr("fill", "steelblue")
    d3.selectAll(".storeTip").remove()
});

// Helper function to keep the click handler shorter
function updateStoreAxis() {
    // rebuild the scale
    var x0 = xStoreScale.domain(storeData.map(function (d) {return d.Store;}));
    // move the bars around based on new scale
    d3.selectAll(".storeBar")
        .attr("x", function(d) {return x0(d.Store);});
    // render axis using new scale
    d3.select(".x-axis-stores").call(xStoreAxis);
}

// click event for the Store chart
var sortStoreDescending = true
var sortStoreChartByRevenueDescending = true
d3.select("#svgStore").on("mousedown", function(event)
{
    var mouseCoords = d3.pointer(event)
    if (mouseCoords[0] < margin.left)
    {
        // clicked the Y axis: sort by revenue
        storeData.sort((a, b) => sortStoreChartByRevenueDescending
            ? b.Revenue - a.Revenue : a.Revenue - b.Revenue)
        sortStoreChartByRevenueDescending = !sortStoreChartByRevenueDescending
        updateStoreAxis()
    }
    else if (mouseCoords[1] > height - margin.bottom)
    {
        // clicked the X axis: sort by store name
        storeData.sort((a, b) => sortStoreDescending
            ? b.Store.localeCompare(a.Store) : a.Store.localeCompare(b.Store))
        sortStoreDescending = !sortStoreDescending
        updateStoreAxis()
    }
});
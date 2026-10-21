// Parameters for the canvas we are about to draw upon
var height = 500
var width = 900

var margin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 50,
}

// Next, we derive total year revenues per year and per store from the raw data. These lists start empty
var yearData = []
var storeData = []
// We will also need to grab the min and max revenue for the histogram's purposes.
// Better to do this ONCE than each time we need to redraw the histogram
var minRevenue = 10000000000 // A big number! (could be improved if this language has a _MAX like C, didnt look)
var maxRevenue = 0
for(j = 0; j < rawData.length; ++j)
{
    // read this revenue at this dictionary as a number (starts as a string)
    var revenueHere = parseFloat(rawData[j].Revenue)
    
    //////////////////////////////////////////////
    // year block
    var foundYear = false
    for(i = 0; i < yearData.length; ++i)
        // if we have previously seen records from this year, add to the total
        if(rawData[j].Year == yearData[i].Year)
        {
            yearData[i].Revenue += revenueHere;
            foundYear = true
            break;
        }
    // If we didnt find it, create new record
    if(!foundYear)
        yearData.push({ Year: rawData[j].Year, Revenue: revenueHere})
      
    //////////////////////////////////////////////
    // store block
        
    var foundStore = false
    for(i = 0; i < storeData.length; ++i)
        if(rawData[j].Store == storeData[i].Store)
        {
            storeData[i].Revenue += revenueHere;
            foundStore = true
            break;
        }
    if(!foundStore)
        storeData.push({ Store: rawData[j].Store, Revenue: revenueHere })
        
    //////////////////////////////////////////////
    // Find min/max values for histogram formation
    if(revenueHere > maxRevenue)
        maxRevenue = revenueHere
    if(revenueHere < minRevenue)
        minRevenue = revenueHere
}

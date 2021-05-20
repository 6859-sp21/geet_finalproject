function takkar(){


    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 950 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#vis")
    .select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/geetkalra/weblab/master/mini.csv").then(function(data) {

// List of groups (here I have one group per column)
// var allGroup = ["valueA", "valueB", "valueC"]
var allGroup = data.columns.slice(1)
    console.log(allGroup)
    console.log(data)
// Reformat the data: we need an array of arrays of {x, y} tuples
var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
  return {
    name: grpName,
    values: data.map(function(d) {
      return {time: d.date, value: +d[grpName]};
    })
  };
});
console.log(dataReady)
// I strongly advise to have a look to dataReady with
// console.log(dataReady)



// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .range(d3.schemeSet2);

// Add X axis --> it is a date format
var x = d3.scaleLinear()
  .range([ 0, width ]);



// Add Y axis
var y = d3.scaleLinear()
  .range([ height, 0 ]);




x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0,9000]);
// y.domain([
//         d3.min(allGroup, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
//         d3.max(allGroup, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
//     ]);

myColor.domain(allGroup.map(function(c) { return c.grpName; }));


svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));


svg.append("g")
  .call(d3.axisLeft(y));


// Add the lines
var line = d3.line()
  .x(function(d) { return x(+d.time) })
  .y(function(d) { return y(+d.value) })
svg.selectAll("myLines")
  .data(dataReady)
  .enter()
  .append("path")
    .attr("d", function(d){ return line(d.values) } )
    .attr("stroke", function(d){ return myColor(d.name) })
    .style("stroke-width", 4)
    .style("fill", "none")


    // var totalLength = path.node().getTotalLength();

// path
// .attr("stroke-dasharray", totalLength + " " + totalLength)
// .attr("stroke-dashoffset", totalLength)
//     .transition() // Call Transition Method
// .duration(2000) // Set Duration timing (ms)
// .ease(d3.easeLinear) // Set Easing option
// .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition


// Add the points

svg
  // First we need to enter in a group
  .selectAll("myDots")
  .data(dataReady)
  .enter()
    .append('g')
    .style("fill", function(d){ return myColor(d.name) })
  // Second we need to enter in the 'values' part of this group
  .selectAll("myPoints")
  .data(function(d){ return d.values })
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.time) } )
    .attr("cy", function(d) { return y(d.value) } )
    .attr("r", 5)
    .attr("stroke", "white")

// Add a legend at the end of each line
svg
  .selectAll("myLabels")
  .data(dataReady)
  .enter()
    .append('g')
    .append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
      .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
      .attr("x", 12) // shift the text a bit more right
      .text(function(d) { return d.name; })
      .style("fill", function(d){ return myColor(d.name) })
      .style("font-size", 15)

})

}
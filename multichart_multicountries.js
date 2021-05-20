

function GDPPERCAPITA() {
// Commented version of
// https://bl.ocks.org/mbostock/3884955

// // Variables
var margin = {top: 50, right: 80, bottom: 250, left: 80},
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
    // let svg = d3.select("#vis")
    // .append('svg')
    // .attr('width', 1000)
    // .attr('height', 950)
    // .attr('opacity', 1);

    // let svg2 = d3.select("#vis")
    // .append('svg')
                        // https://raw.githubusercontent.com/geetkalra/weblab/master/mini.csv
                        // https://raw.githubusercontent.com/geetkalra/weblab/master/gdpPERcapita.csv

d3.csv("https://raw.githubusercontent.com/geetkalra/weblab/master/gdpPERcapita.csv")
.then(function(data) {
  
// entries = data.columns.slice(1)
allCountries = data.columns.slice(1)
d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allCountries)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })



        entries = ["India"];

        update()
function update(){

    // let svg = d3.select("#vis").select("svg")
svg.selectAll("*").remove()
    var cities =  entries.map(function(id) {
        return {
        id: id,
        values: data.map(function(d) {
            return {date: d.date, gdpPercapita: parseInt(d[id]) || 0};
        })
        };
    });
    console.log(cities)
    // Scale X - time scale
    // Scale Y - linear scale
    // Scale Z - color categorical scale
    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    // D3 Line generator with curveBasis being the interpolator
    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.gdpPercapita); });

    // Using the initial data figure out the min / max dates
    x.domain(d3.extent(data, function(d) { return d.date; }))
    .nice();
    


    y.domain([
        d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.gdpPercapita; }); }),
        d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.gdpPercapita; }); })
    ])
    .nice();
    

    //   y.domain([120,9000]);

    z.domain(cities.map(function(c) { return c.id; }));

    // Create X Axis
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .append('text')
          .attr('text-anchor', 'end')
          .attr('fill', 'black')
          .attr('font-size', '24px')
          .attr('font-weight', 'bold')
          .attr('x', width )
          .attr('y', 50)
          .text('Year');
    // Create Y Axis
    // Add Text label to Y axis
    // svg.selectAll("#axis axis--y"").remove();

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(0,0)")
        .transition()
        .duration(500)
        .call(d3.axisLeft(y))
        
      svg.selectAll("axis axis--y")  
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("GDP Per Capita (US $)");


    // Create a <g> element for each city
    var city = svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

        // Create a <path> element inside of each city <g>
        // Use line generator function to convert 366 data points into SVG path string
    var path = city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); })
       path.attr("stroke-dasharray", function(d) {
                        // Get the path length of the current element
                        const pathLength = this.getTotalLength();
                        console.log(`0 ${pathLength}`)
                        return `0 ${pathLength}`
                })
        .transition()
        .duration(2500)
        .attr("stroke-dasharray", function(d) {
            // Get the path length of the current element
            const pathLength = this.getTotalLength();
            console.log(`${pathLength} ${pathLength}`)
            return `${pathLength} ${pathLength}`
                                             });

        path.on("click", function(d,i){
                                    const index = entries.indexOf(d.id);
                                    console.log(d)
                                    console.log("this is the index")
                                    console.log(index)
                                    if (index > -1) {
                                        entries.splice(index, 1);
                                        update();
                                    }
                                    console.log(entries)
                                // entries.splice(i, 1);
                                
                                });
  
        
    // .append("div")
    //     .attr("class","tooltip")
    //     .style("opacity",0);
    const symbol = d3.symbol();
      // Add points at each location to provide tooltips
      svg.selectAll("myDots")
      .data(cities)
      .enter()
        .append('g')
        .style("fill", function(d){ console.log("hereiam");console.log(d); return z(d.id) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function(d){ 
          place = d.id
          for (ii in d.values) {
                d.values[ii].country  = place;
                }
          return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) {console.log("onceagain");console.log(d); return y(d.gdpPercapita); } )
        .attr("r", 5)
        .style("opacity",0)
        .attr("stroke", "white")
        .on("mouseover",function(d,i){
            d3.select(this).style("opacity",1);
            console.log("rockyoulikeahurricane");
            console.log(d)
            d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .style("background", z(d.country))
            .html("Country: " + d.country + "<br/>  GDP Per Capita: " + d.gdpPercapita + "<br/> Year: " + d.date)



            // tooltip.transition()
            //    .duration(200)
            //    .style("opacity", .9);
            //  tooltip.html("Country: " + d.country + "<br/>  GDP Per Capita: " + d.gdpPercapita + "<br/> Year: " + d.date)
            //    .style("left", (event.pageX) + "px")
            //    .style("background", z(d.country))
            //    .style("top", (event.pageY - 28) + "px");

              d3.select(this)
                .attr("fill", "black")
                .attr("d", symbol.size(64 * 4));
            
            // tooltip.style("opacity",1)
            // tooltip.html("Country: " + d.country
            //     + " GDP Per Capita: " + d.gdpPercapita + " Year: " +d.date
            //     )
                    })
        .on("mouseout", function(d,i) {
            d3.select(this).style("opacity",0);
            d3.select('#tooltip')
            .style('display', 'none')
            //  tooltip.transition()
            //    .duration(500)
            //    .style("opacity", 0);

             d3.select(this)
                .attr("fill", z(d.country))
                .attr("d", symbol.size(64));

            });
        
    //label in the background if only one country is being viewed
    if (cities.length == 1){
        const yearLabel = svg.append('text')
      .attr('x', 40)
      .attr('y',  margin.bottom + margin.top  )
      .attr('fill', '#ccc')
      .attr('font-family', 'Helvetica Neue, Arial')
      .attr('font-weight', 500)
      .attr('font-size', 80)
      .text(cities[0].id);
    //   console.log(cities)
        }

        




  // Add a legend at the end of each line if there are multiple lines
  if (cities.length > 1){
    city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.gdpPercapita) + ")"; })
        .attr("x", -60)
        .attr("y", -10)
        .attr("dy", "0.35em")
        .style("font", "16px sans-serif")
        .text(function(d) { return d.id; });
  }

}




d3.select("#add-btn").on("click", function(e){
    // entries = ["India"]
    entries.push("India")
    //Makes sure India doesn't get added multiple times to the
    const unique = [...new Set(entries)];
    entries = unique
    update()
});

d3.select("#replay").on("click", function(e){
    entries = ["India"]
    update()
});

d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        entries = [selectedOption]
        update()
        console.log(selectedOption)
    })



}

);

}
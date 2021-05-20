

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
                    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


                        // https://raw.githubusercontent.com/geetkalra/weblab/master/mini.csv
                        // https://raw.githubusercontent.com/geetkalra/weblab/master/gdpPERcapita.csv
                        
d3.csv("https://raw.githubusercontent.com/6859-sp21/a4-worldbankdata/main/gdpPERcapita2.csv")
.then(function(data) {
 
// entries = data.columns.slice(1)
allCountries = data.columns.slice(1)

d3.select("#selectButton")
    .selectAll("*")
    .remove()

d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allCountries)
    .enter()
    .append('option')
    .text(function (d,i) { return i+1+"."+d; }) // text showed in the menu
    .attr("value", function (d) { return d; })



        // entries = ["Monaco","Luxembourg","Bermuda","India"];
entries = ["India"];

// ##initializing y axis

console.log('here',data)


// x.domain(d3.extent(data, function(d) { return d.date; }))
// .nice();
// Defining x, y and z(categorical) scales
let x = d3.scaleLinear()
          .domain([1960,2020])
          .range([0, width])
          .nice();

let z = d3.scaleOrdinal(d3.schemeCategory10);

let y = d3.scaleLinear()
            .domain([0, 100000000000])
            .range([height, 0]);

let yAxis = d3.axisLeft()
            .scale(y)
            .ticks(width > 500 ? 5:2)
            .tickSize(-(height-margin.top-margin.bottom))
            .tickFormat(d => d3.format(',')(d));

svg.append('g')
    .attr('class', 'axis yAxis')
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll('.tick line')
    .classed('origin', d => d == 0);

svg.select('.yAxis')
    .append("text")
    .transition()
    .duration(1100)
    .ease(d3.easeLinear)
    .attr("transform", "rotate(-90)")
    .attr('y', 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .attr('font-size', '24px')
    .attr('font-weight', 'bold')
    .text("GDP Per Capita (US $)");


// Create X Axis
svg.append("g")
    .attr("class", "axis xAxis")
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

// D3 Line generator with curveBasis being the interpolator
var line = d3.line()
.curve(d3.curveLinear)
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.gdpPercapita); });




 // ## InitializeNodes to introduce tooltips
const symbol = d3.symbol();
const gPoints = svg.append('g');
const country_lines = svg.append('g');
update()

function update(){

        // let svg = d3.select("#vis").select("svg")
        // svg.selectAll("*").remove()

        var cities =  entries.map(function(id) {
            return {
            id: id,
            values: data.map(function(d) {
                return {date: d.date, gdpPercapita: parseInt(d[id]) || 0};
            })
            };
        });

        console.log('the citiers',cities)
        // ##Updating the y domain based on selection
        y.domain([
            d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.gdpPercapita; }); }),
            d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.gdpPercapita; }); })
        ])
        .nice();

        // ##Rebuilding (re-calling) the y axis with the new domain
        svg.select('.yAxis')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(yAxis);


        z.domain(cities.map(function(c) { return c.id; }));

        // Create a <g> element for each city
        var city = svg.selectAll(".city")
            .data(cities)
            .enter().append("g")
            .attr("class", "city");


    


    
    // country_lines
    //     .selectAll('path')
    //     .data(cities)
    //     .join('path')
    //     // .attr("stroke-dasharray", function(d) {
    //     //                 // Get the path length of the current element
    //     //                 const pathLength = this.getTotalLength();
    //     //                 return `0 ${pathLength}`
    //     //                 })
    //     .attr("stroke-dasharray", function(d) {
    //         // Get the path length of the current element
    //         const pathLength = this.getTotalLength();
    //         return `${pathLength} ${pathLength}`
    //     })
    //     .transition()
    //         .duration(2000)
    //         .ease(d3.easeLinear)
    //         .attr('class',(d) => {return `line ${d.id}`;})
    //         .attr("d", function(d) { return line(d.values); })
    //         .style("stroke", function(d) { return z(d.id); })
    //         // .attr("stroke-dasharray", function(d) {
    //         //             // Get the path length of the current element
    //         //             const pathLength = this.getTotalLength();
    //         //             return `0 ${pathLength}`
    //         //             })
    //         // .transition()
    //         //     .duration(2000)
    //         //     .ease(d3.easeLinear)
            
            
    //     packed_country_lines = country_lines
    //                             .selectAll('path')
    //                             .data(cities)

    //     packed_country_lines
    //         .enter()
    //         .append('path')

// let linePath = svg.selectAll('.eecity').data(cities, (d)=>{console.log('thisis',cities)});
let linePath  = country_lines
        .selectAll('path')
        .data(cities)


    linePath
        .enter()
        .append('path')
        // .attr("stroke-dasharray", function(d) {
        //     // Get the path length of the current element
        //     const pathLength = this.getTotalLength();
        //     return `0 ${pathLength}`
        //     })
        .attr('class',(d) => {return `line ${d.id}`;})
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); })
        // .transition()
        //     .duration(2000)
        //     .ease(d3.easeLinear)
        //     .attr("stroke-dasharray", function(d) {
        //                                 // Get the path length of the current element
        //                                 const pathLength = this.getTotalLength();
        //                                 return `${pathLength} ${pathLength}`
        //                         });
 

        linePath
        //    .attr("stroke-dasharray", function(d) {
        //     // Get the path length of the current element
        //     const pathLength = this.getTotalLength();
        //     return `0 ${pathLength}`
        //     })
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('class',(d) => {return `line ${d.id}`;})
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return z(d.id); })
            // .attr("stroke-dasharray", function(d) {
            //                                     // Get the path length of the current element
            //                                     const pathLength = this.getTotalLength();
            //                                     return `${pathLength} ${pathLength}`
            //                             });
                
        linePath
        .exit()
        .attr("stroke-dasharray", function(d) {
            // Get the path length of the current element
            const pathLength = this.getTotalLength();
            return `${pathLength} ${pathLength}`
            })
        .transition()
        .duration(800)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", function(d) {
                            // Get the path length of the current element
                            const pathLength = this.getTotalLength();
                            return `0 ${pathLength}`
                            })
        //    .attr('width', d => x(d.value)-x(0)-1)
        //    .attr('y', d => y(top_n+1)+665)
        .remove();
        

        

        // Add a legend at the end of each line if there are multiple lines
        if (cities.length > 1){
                    city.append("text")
                        .datum(function(d) { console.log('d before random trans',d);return {id: d.id, value: d.values[d.values.length - 1]}; })
                        .attr("transform", function(d) { console.log('d after random trans',d);return "translate(" + x(d.value.date) + "," + y(d.value.gdpPercapita) + ")"; })
                        .attr("x", -60)
                        .attr("y", -10)
                        .attr("dy", "0.35em")
                        .style("font", "16px sans-serif")
                        .attr("fill", function(d) { return z(d.id); })
                        .text(function(d) { return d.id; });
                 }

        if (cities.length == 1){
            const yearLabel = svg.append('text')
                                    .attr('x', 40)
                                    .attr('y',  margin.bottom + margin.top  )
                                    .attr('fill', '#ccc')
                                    .attr('font-family', 'Helvetica Neue, Arial')
                                    .attr('font-weight', 500)
                                    .attr('font-size', 80)
                                    .text(cities[0].id+"*");
                        }



       
        // Add points at each location to provide tooltips
        console.log('printing cities here',cities)
        // gPoints.selectAll("myDots")
        //     .data(cities)
        //     .enter()
        //     .append('g')
        //     .style("fill", function(d){  return z(d.id) })
        //     .attr('class','sdsd')
        //     // Second we need to enter in the 'values' part of this group
        //     .selectAll("myPoints")
        //     .data(function(d){ 
        //             place = d.id
        //             for (ii in d.values) {
        //                     d.values[ii].country  = place;
        //                     }
        //             return d.values 
        //          })
        //     .enter()
        //     .append("circle")
        //         .attr("cx", function(d) {console.log("what are here",d); return x(d.date); } )
        //         .attr("cy", function(d) { return y(d.gdpPercapita); } )
        //         .attr("r", 5)
        //         .style("opacity",0.5)
        //         .attr("stroke", "white")
        //         .on("mouseover",function(d,i){
        //                     d3.select(this).style("opacity",1);
        //                     d3.select('#tooltip')
        //                     .style('left', (d3.event.pageX + 10)+ 'px')
        //                     .style('top', (d3.event.pageY - 25) + 'px')
        //                     .style('display', 'inline-block')
        //                     .style("background", z(d.country))
        //                     .html("Country: " + d.country + "<br/>  GDP Per Capita (US $): " + d.gdpPercapita + "<br/> Year: " + d.date)
        //                     d3.select(this)
        //                         .attr("fill", "black")
        //                         .attr("d", symbol.size(64 * 4));
        //             })

        //         .on("mouseout", function(d,i) {
        //                     d3.select(this).style("opacity",0);
        //                     d3.select('#tooltip')
        //                     .style('display', 'none')
        //                     d3.select(this)
        //                         .attr("fill", z(d.country))
        //                         .attr("d", symbol.size(64));
        //             });


    // gPoints
    //     .selectAll('path')
    //     .data(cities)
    //     .join('path')
    //     .transition()
    //     .duration(2000)
    //     .ease(d3.easeLinear)
    //     .attr('fill', d => z(d.id))

    //     .attr('transform', (d,i) =>  `translate(${x(d.values[date])}, ${y(d.values[gdpPercapita])})`)
        
    //     .attr('d', d => symbol())
    //     .attr('class','indiapoint')
    //     // .on("mouseover",function(d,i){
    //     //                 d3.select(this).style("opacity",1);
    //     //                 d3.select('#tooltip')
    //     //                 .style('left', (d3.event.pageX + 10)+ 'px')
    //     //                 .style('top', (d3.event.pageY - 25) + 'px')
    //     //                 .style('display', 'inline-block')
    //     //                 .html("Country: " + d["Country Name"] + "<br/>  GDP (Billion US $): " + d[xVar]+"             " + yVar+":" + d[yVar])
    //     //                   d3.select(this)
    //     //                     .attr("d", symbol.size(64 * 4));
    //     //         })
    //     // .on("mouseout", function(d,i) {
    //     //             d3.select(this).style("opacity",1);
    //     //             d3.select('#tooltip')
    //     //               .style('display', 'none')
    //     //             d3.select(this)
    //     //                 .attr("d", symbol.size(64));
    //     //         });


    }//update function ends here




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

    d3.select("#topten").on("click", function(e){
        entries = ["India","Monaco","Luxembourg","Bermuda"]//,"Norway","Switzerland"] //,"Ireland","Denmark","Qatar","Singapore","Macao SAR, China"]
        update()
    });
    d3.select("#lowerten").on("click", function(e){
        entries = ["India","Burundi","Central African Republic"]
        update()
    });





    d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            entries.push(selectedOption)
            // entries = [selectedOption]
            const unique = [...new Set(entries)];
            entries = unique
            update()
        })



}

);

}
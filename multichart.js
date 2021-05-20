

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



// x.domain(d3.extent(data, function(d) { return d.date; }))
// .nice();
// Defining x, y and z(categorical) scales
let x = d3.scaleLinear()
          .domain([1960,2020])
          .range([0, width])
          .nice();

// let z = d3.scaleOrdinal(d3.schemeCategory10);
let z = d3.scaleOrdinal()
          .domain(allCountries)
          .range(d3.schemeTableau10);


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

// var dedoPoints = function (d) {

//     return d.

// }



 // ## InitializeNodes to introduce tooltips
const symbol = d3.symbol();
const gPoints = svg.append('g');
const country_lines = svg.append('g');
const line_end_text = svg.append('g');
const circles_tooltips = svg.append('g');

function opencitiesDates(d) {
    console.log(d);
    console.log(d[0]);
    console.log(d[0].values);
    return d[0].values;
}


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


        // z.domain(cities.map(function(c) { return c.id; }));

        // Create a <g> element for each city
        var city = svg.selectAll(".city")
            .data(cities)
            .enter().append("g")
            .attr("class", "city");


    


    // ##Plotting lines using .join. However, it gives little control over exit transitions. the join procedure for exit transitions was giving random error
    // country_lines
    //     .selectAll('path')
    //     .data(cities)
    //     .join('path')
    //     .transition()
    //         .duration(2000)
    //         .ease(d3.easeLinear)
    //         .attr('class',(d) => {return `line ${d.id}`;})
    //         .attr("d", function(d) { return line(d.values); })
    //         .style("stroke", function(d) { return z(d.id); })
    
 
//  console.log('yesdehro',opencitiesDates(cities))

        // ##Plotting the lines
        plotlines()
        function plotlines(){
        let linePath  = country_lines
                .selectAll('path')
                .data(cities)

            linePath
                .enter()
                .append('path')
                .attr('class',(d) => {return `line ${d.id}`;})
                .attr("d", function(d) { return line(d.values); })
                .style("stroke", function(d) { return z(d.id); })
                .transition()
                    .duration(1000)
                    .ease(d3.easeLinear) 

                linePath
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                        .attr('class',(d) => {return `line ${d.id}`;})
                        .attr("d", function(d) { return line(d.values); })
                        .style("stroke", function(d) { return z(d.id); })
                
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

                .remove();


                // linePath.on("click", function(d,i){
                //     const index = entries.indexOf(d.id);
                
                //     if (index > -1) {
                //         entries.splice(index, 1);
                //         update();
                //     }
                // // entries.splice(i, 1);
                
                // });
                                }

        
        // ## Plotting the country labels at the end of the lines                      
       let country_name_at_line_end =  line_end_text.selectAll('text').data(cities)
        
       country_name_at_line_end
             .enter()
             .append('text')
             .datum(function(d) { return {id: d.id, LastValue: d.values[d.values.length - 1]}; })
            //  .transition()
            //  .duration(200)
            //  .ease(d3.easeLinear)
                .attr("transform", function(d) { return "translate(" + x(d.LastValue.date) + "," + y(d.LastValue.gdpPercapita) + ")"; })
                .attr("x", -60)
                .attr("y", -10)
                .attr("dy", "0.35em")
                .style("font", "16px sans-serif")
                .attr("fill", function(d) { return z(d.id); })
                .text(function(d) { return d.id; });
        
        country_name_at_line_end
             .datum(function(d) { return {id: d.id, LastValue: d.values[d.values.length - 1]}; })
             .transition()
             .duration(1900)
             .ease(d3.easeLinear)
                .attr("transform", function(d) { return "translate(" + x(d.LastValue.date) + "," + y(d.LastValue.gdpPercapita) + ")"; })
                .attr("x", -60)
                .attr("y", -10)
                .attr("dy", "0.35em")
                .style("font", "16px sans-serif")
                .attr("fill", function(d) { return z(d.id); })
                .text(function(d) { return d.id; });

        country_name_at_line_end
            .exit()
            .remove()

            country_name_at_line_end
            .on("click", function(d,i){
                const index = entries.indexOf(d.id);
            
                if (index > -1) {
                    entries.splice(index, 1);
                    update();
                }
            // entries.splice(i, 1);
            
            });

    // var returnDate = cities.map(function(d) {return {id: d.id, vals: d.values};})

    //    console.log('yahanse',cities)
    //    console.log('yahasdsdanse', returnDate)


    let tooltipFacilitator = circles_tooltips
                                .selectAll('g')
                                .data(cities)

    tooltipFacilitator
            .enter()
            .append('g')
            .attr('class','themCircles')
            .attr('fill', d=> z(d.id))  
            .selectAll('circle')
            .data(function (d) { 
                                        place = d.id
                                        for (ii in d.values) {
                                            d.values[ii].country  = place;
                                            }
                                        return d.values 
                                    }
                    )
    
            .enter()
            .append('circle')
            .attr('class','theseCircles')
            .attr("cx", function(d) { return x(d.date) } )
            .attr("cy", function(d) { return y(d.gdpPercapita); } )
            .attr("r", 5)
            .style("opacity",0)
            .on("mouseover",function(d,i){
                        console.log('geet',d3.event.pageY)
                        Yloc = d3.event.pageY - 25
                        Xloc = d3.event.pageY +10
                        console.log('geet',Yloc)
                        d3.select('#tooltip')
                        .style('display', 'inline-block')
                        .style('left', (d3.event.pageX + 10)+ 'px')
                        .style('top', (d3.event.pageY - 25) + 'px')
                        // .style("left", d3.select(this).attr("cx")  + "px")     
                        // .style("top", d3.select(this).attr("cy")+y(-1) + "px")
                        .style("background", z(d.country))
                        // .html("Country: " + d.country + "GDP (Billion US $): " +d.gdpPercapita )
                        .html("Country: " + d.country + "<br/>  GDP (Billion US $): " + d.gdpPercapita + "<br/> Year: " + d.date)

            
                        d3.select(this)
                            .attr("fill", "black")
                            .attr("d", symbol.size(64 * 4));
            
                        })
            .on("mouseout", function(d,i) {
                                d3.select(this).style("opacity",0);
                                d3.select('#tooltip')
                                    .style('display', 'none')
                               
                    
                                // d3.select(this)
                                //     .attr("fill", z(d.country))
                                //     .attr("d", symbol.size(64));
                        });

    tooltipFacilitator
            .selectAll('circle')
            // .transition()
            // .duration(2000)
            // .ease(d3.easeLinear)
            .attr('class','theseCircles')
            .attr("cx", function(d) { return x(d.date) } )
            .attr("cy", function(d) { return y(d.gdpPercapita); } )
            .attr("r", 5)
            .style("opacity",0)

            tooltipFacilitator.exit().remove()

            // twosd.exit().transition().remove()   
            // .attr("stroke", "white")



            // .attr('d', d => symbol())
            // .attr('transform', d => `translate(${x(d.date)}, ${y(d.gdpPercapita)})`)
     


    

// console.log('doodhKadoodh', returndates(cities[0].values))




    //     let tooltipFacilitator = circles_tooltips
    //                                 .selectAll('nutcases')
    //                                  .data(cities)
    //                                  .enter()
    //                                 .append('g')
        
    //    let kkk =  tooltipFacilitator   
    //         .selectAll('path')
    //         .data(function(d){ 
    //             place = d.id
    //             for (ii in d.values) {
    //                   d.values[ii].country  = place;
    //                   }
    //             return d.values })
    //     kkk
    //         .enter()
    //         .append('path')
    //         .transition()
    //         .duration(2000)
    //         .ease(d3.easeLinear)
    //         .attr('fill', d => {console.log('coming'); return z(d.id);})
    //         .attr('d', d => symbol())
    //         .attr('transform', d =>  `translate(${x(d.date)}, ${y(d.gdpPercapita)})`)

    //     // tooltipFacilitator
    //     kkk
    //         .selectAll('path')
    //         .transition()
    //         .duration(2000)
    //         .ease(d3.easeLinear)
    //         // .attr('fill', d =>  z(d.id))
    //         // .attr('d', d => symbol())
    //         .attr('transform', d=> `translate(${x(d.date)}, ${y(d.gdpPercapita)})`)
                            

    //     kkk 
    //         .selectAll('path')
    //         .exit()
    //         .remove()
            // .attr('transform', (d) =>  `translate(${x(d.values[date])}, ${y(d.values[gdpPercapita])})`)
        
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
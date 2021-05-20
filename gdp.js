
function callmepls(){
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

            // var svg2 = d3.select("#my_dataviz2")
            //     .append("svg")
            //         .attr("width", width + margin.left + margin.right)
            //         .attr("height", height + margin.top + margin.bottom)
            //     .append("g")
            //         .attr("transform",
            //             "translate(" + margin.left + "," + margin.top + ")");




        d3.csv("https://raw.githubusercontent.com/geetkalra/weblab/master/gdpPERcapita.csv")
        
                .then( 
            
                        function(data)
                            {

                                //X Axis
                                var x = d3.scaleLinear()
                                    // .domain(d3.extent(data,d=>d.Year))
                                    .domain(d3.extent(data, function(d){return d.date}))
                                    .range([0,width]);
                                
                                svg.append("g")
                                    .attr("transform","translate(0," +height+")")
                                    .call(d3.axisBottom(x).tickFormat(d3.format("d"))) // tickformat "d" helps to remove comma from year numbers if using Scale Linear
                                
                                //Y Axis
                                var y = d3.scaleLinear()
                                    .domain([0,7000])
                                    // .domain(d3.extent(data, d=>d.India))
                                    .range([height,0]);
                                
                                svg.append("g")
                                    .attr("transform", "translate(0,0)")
                                    .call(d3.axisLeft(y)) 
                                
                                 // Actual path
                                var path = svg.append("path")
                                    .attr("transform", "translate(0,0)")
                                    .datum(data) 
                                    .attr("fill","none")
                                    .attr("stroke","steelblue")
                                    .attr("stroke-width",4)
                                    .attr("d",d3.line()
                                                    .x(d=>x(d.date))
                                                    .y(d=>y(d.India))
                                    
                                    
                                        )  

                                // Variable to Hold Total Length
                                var totalLength = path.node().getTotalLength();
                                path
                                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                                    .attr("stroke-dashoffset", totalLength)
                                .transition() // Call Transition Method
                                    .duration(2000) // Set Duration timing (ms)
                                    .ease(d3.easeLinear) // Set Easing option
                                    .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

                            }
                        )

                        }
        
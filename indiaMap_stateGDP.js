function mapplot(){

  // https://embed.plnkr.co/i2eLwxweLJhuUgTuOS4x/
  // https://www.d3-graph-gallery.com/graph/pie_changeData.html
  // https://statisticstimes.com/economy/sectorwise-gdp-of-indian-states.php
  // http://bl.ocks.org/dbuezas/9306799

    var margin = {top: 50, right: 80, bottom: 250, left: 80},
                width = 1000 - margin.left - margin.right,
                height = 950 - margin.top - margin.bottom;

  
    var w = width;
    var h = height;
    var proj = d3.geo.mercator();
    var path = d3.geo.path().projection(proj);
    var t = proj.translate(); // the projection's default translation
    var s = proj.scale() 

    function initialize() {
      proj.scale(6700);
      proj.translate([-1240, 720]);
    }

    var map = d3.select("#vis").select("svg")
                .attr("width", w)
                .attr("height", h)
      //.call(d3.behavior.zoom().on("zoom", redraw))
               .call(initialize);

    var india = map.append("svg:g")
                  .attr("id", "india");

    var radius = 80
    
    var pieChart = map.append("svg:g")
                  .attr("id", "pieChart")
                  .attr("transform", "translate(" + width / 1.3 + "," + height / 1.7 + ")");
    
                  var data1 = {a: 9, b: 20, c:30, d:8, e:12}
                  var data2 = {a: 6, b: 16, c:20, d:14, e:19}
    
        pieChart.append("g")
            .attr("class", "slices");
        pieChart.append("g")
            .attr("class", "labels");
        pieChart.append("g")
            .attr("class", "lines");
    // var button1 = map.append('botton')

    var tooltip_map = d3.select("body").append('div')
      .attr("class", "tooltip_map")
      .style("opacity", 0);

    var buckets = 9,
      colors = ["#020024", "#04304c", "#166075", "#067a86", "#09c3c6", "#48d2d5", "#8be3e4", "#c0f0f0"];
      // colors = ["#c0f0f0", "#c0f0f0", "#8be3e4", "#48d2d5", "#09c3c6", "#067a86", "#166075", "#04304c", "#04304c"]
      pieLelo = "https://raw.githubusercontent.com/geetkalra/weblab/master/statewiseGDP_dist.csv"

    d3.json("https://raw.githubusercontent.com/geetkalra/weblab/master/states.json") .then(function(json) {  
      d3.csv("https://raw.githubusercontent.com/geetkalra/weblab/master/State_wise_SDP_Gross.csv") .then(function(Gross) {
        d3.csv("https://raw.githubusercontent.com/geetkalra/weblab/master/State_wise_SDP_PC.csv  ") .then(function(PerCapita) {
          d3.csv(pieLelo) .then(function(pieData) {

            EconSectors = pieData.columns.slice(1)

            var pie = d3.pie()
                        .sort(null)
                        .value(function(d) {
                          return d.value;
                        });

            var arc = d3.arc()
                  .outerRadius(radius * 0.8)
                  .innerRadius(radius * 0.4);

          var outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);

            
            var pieColor = d3.scaleOrdinal()
                .domain(EconSectors)
                .range(d3.schemeDark2);
            

            initial_val = {Agriculture: "10", Industry: "10", Manufacturing: "10", Mining: "10",  Services: "10"}
            pieUpdate(initial_val)
            second_val = {Agriculture: "10", Industry: "10", Manufacturing: "10", Mining: "10",  Services: "10"}
            pieUpdate(second_val)
            function pieUpdate(data) {

                      // Compute the position of each group on the pie:
                      var pie = d3.pie()
                        .value(function(d) {return d.value; })
                        .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
                      
                      var arcGenerator = d3.arc()
                                          .innerRadius(0)
                                          .outerRadius(1.3*radius)

                      var outerArc = d3.arc()
                                .innerRadius(radius * 0.9)
                                .outerRadius(radius * 0.9);

                      var key = function(d){ return d.data.label; };

                      var data_ready = pie(d3.entries(data))
                    
                        // ##SLICES
                        var slice = pieChart.select(".slices").selectAll("path.slice")
                                  		.data(data_ready);

                                  	slice.enter()
                                  		.insert("path")
                                  		.style("fill", function(d) { return pieColor(d.data.key); })
                                  		.attr("class", "slice");

                                  	slice		
                                  		.transition().duration(1000)
                                  		.attrTween("d", function(d) {
                                  			this._current = this._current || d;
                                  			var interpolate = d3.interpolate(this._current, d);
                                  			this._current = interpolate(0);
                                  			return function(t) {
                                  				return arc(interpolate(t));
                                  			};
                                  		})

                                  	slice.exit()
                                  		.remove();

                        // add labels TEXT LABELS
                      var u_text = pieChart.select(".labels").selectAll("text")
                              .data(data_ready)

                          u_text
                              .enter()
                                .append("text")
                                .attr("dy", ".35em")
                                .text(d =>  {return `${d.data.key}`;})

                                // .text(d =>  {console.log('ee',d.data); return `${d.data.key}: ${d.data.value.toLocaleString()}`;})
                  
                                function midAngle(d){
                                        return d.startAngle + (d.endAngle - d.startAngle)/2;
                                      }

                          u_text.transition().duration(1000)
                              .attrTween("transform", function(d) {
                                        this._current = this._current || d;
                                        var interpolate = d3.interpolate(this._current, d);
                                        this._current = interpolate(0);
                                        return function(t) {
                                          var d2 = interpolate(t);
                                          var pos = outerArc.centroid(d2);
                                          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                                          return "translate("+ pos +")";
                                        };
                                      })
                                .styleTween("text-anchor", function(d){
                                  this._current = this._current || d;
                                  var interpolate = d3.interpolate(this._current, d);
                                  this._current = interpolate(0);
                                  return function(t) {
                                    var d2 = interpolate(t);
                                    return midAngle(d2) < Math.PI ? "start":"end";
                                  };
                                });

                    u_text.exit()
                      .remove();

                      ///ADD connecting lines to slices

                      var polyline = pieChart.select(".lines").selectAll("polyline")
                              .data(data_ready);
                            
                      polyline.enter()
                              .append("polyline");

                      polyline.transition().duration(1000)
                              .attrTween("points", function(d){
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                  var d2 = interpolate(t);
                                  var pos = outerArc.centroid(d2);
                                  pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                                  return [arc.centroid(d2), outerArc.centroid(d2), pos];
                                };			
                              });
                            
                        polyline.exit()
                              .remove();


                    
                    }

                
                


                
                var extension = d3.extent(Gross, d => parseFloat(d.NSDP_2012_13))     
                                   

                    var colorScale = d3.scaleOrdinal()
                            .domain(extension)
                            .range(colors);
                    
              

                    var y = d3.scaleLinear()
                              .domain(extension)
                              .range([0,300])
                              .nice();
                    let yAxis = d3.axisLeft()
                              .scale(y)
               

                    india.selectAll("path")
                      .data(json.features)
                      .enter().append("path")
                      .attr("d", path)
                      .attr('class',"mapPath")
                      // .style("fill", function (d) { return colorScale(d.total); });
                      .style("opacity", 1)
                      .on('click', function (d, i) {
                                
                                let value = {Agriculture: "10", Industry: "10", Manufacturing: "10", Mining: "10",  Services: "10"}
                    
                                for(ii in pieData){
                                  
                                  if (d.id == pieData[ii].State){
                                        kk = pieData[ii] 

                                        value = {'Agriculture': kk['Agriculture'], 'Industry':kk['Industry'],'Manufacturing': kk['Manufacturing'], 'Mining': kk['Mining'],'Services': kk['Services']  } 
                               
                                        pieUpdate(value);
                                  }
                                  else{pieUpdate(value);}
                                  
                                }
                                

                      })
                      .on('mouseenter', function (d, i) {
                                              for (ii in Gross){
                                                if (Gross[ii].State_UT === d.id){
                                                  stateGDP_2020  = Gross[ii].NSDP_2019_20
                                                }
                                              }
                                              d3.select(this)
                                                  .transition()
                                                  .duration(300)
                                                  .style("opacity", 0.5);
                                              tooltip_map.transition()
                                                  .duration(300)
                                                  .style("opacity", 1)
                                                  .style('display', 'inline-block')
                                                  .style('background','white')
                                              tooltip_map
                                              .html("<h3>"+(d.id)+"</h3><h5> State GDP in 2012-2013 </h5><table>"+
                                                                    "<tr><h3>"+stateGDP_2020+" crore Rs</h3>"+ "</table>")
                                              // .style("left", 845 + "px")
                                              // .style("top", 5856 + "px")
                                              .style("left", (d3.event.pageX + 20) + "px")
                                              .style("top", (d3.event.pageY - 30) + "px");
                                          })
                        .on('mouseleave', function (d, i) {
                                              d3.select(this).transition().duration(300)
                                                .style("opacity", 1);
                                              tooltip_map.transition().duration(300)
                                                .style("opacity", 0);
                                              tooltip_map.exit().transition().duration(300).remove()

                                            })

                india
                  .selectAll("path")
                  
                  .transition()
                  .duration(3000)
                  .style("fill", function (d) { 
                                    
                  
                                    for(ii in Gross){
                                            if (d.id == Gross[ii].State_UT){
                                                    value = Gross[ii].NSDP_2012_13
                                                  }
                                        }
                                  return colorScale(parseFloat(value)); 
                                
                                });




                var g = india.append("g")
                    .attr("class", "key")
                    .attr("transform", "translate(445, 305)")
                    .call(yAxis);

                g.selectAll("rect")
                                .data(colorScale.range().map(function(d, i) {
                                  return {
                                      y0: i ? y(colorScale.domain()[i - 1]) : y.range()[0],
                                      y1: i < colorScale.domain().length ? y(colorScale.domain()[i]) : y.range()[1],
                                      z: d
                                  };
                              }))
                        .enter().append("rect")
                            .attr("width", 7)
                            .attr("y", function(d) { return d.y0; })
                            .attr("height", function(d) { return 240; })

                            // .attr("height", function(d) { return d.y1-d.y0; })
                            .style("fill", function(d) { return d.z; });




                    });
                  });
                });
              });

            }
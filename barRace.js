

function barRace() {
    var tickDuration = 300;
    let year = 1960;
    
    var top_n = 15;
    var margin = {top: 50, right: 80, bottom: 250, left: 80},
    width = 1000 - margin.left - margin.right,
    height = 950 - margin.top - margin.bottom;
  
   

    var svg = d3.select("#vis")
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


    let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);
      
    let title = svg.append('text')
     .attr('class', 'title')
     .attr('y', 24)
     .html('GDP growth since 1960');
  
    let subTitle = svg.append("text")
     .attr("class", "subTitle")
     .attr("y", 55)
     .html("$billion");
   
    let caption = svg.append('text')
     .attr('class', 'caption')
     .attr('x', width)
     .attr('y', height-5)
     .style('text-anchor', 'end')
     .html('Source: World Bank');

    
                // append the svg object to the body of the page

                            
    d3.csv("https://raw.githubusercontent.com/geetkalra/weblab/master/rearranged_inter.csv")
    .then(function(data) {
     
      d3.select("#yearSelected2").selectAll("*").remove()
      d3.select("#yearForSlider2").selectAll("*").remove()
   
        data.forEach(d => {
            d.value = +d.value,
            d.lastValue = +d.lastValue,
            d.value = isNaN(d.value) ? 0 : d.value,
            d.year = +d.year,
            d.colour = d3.hsl(Math.random()*360,0.75,0.75)
          });
    
        
         let yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
          .sort((a,b) => b.value - a.value)
          .slice(0, top_n);
        
    
          yearSlice.forEach((d,i) => d.rank = i);
        
        const countriesHighlight = ['India','China']
        const colorScale = (countryName) => d3.schemeTableau10[countriesHighlight.includes(countryName) ? 1 : 0]
      
         let x = d3.scaleLinear()
            .domain([0, d3.max(yearSlice, d => d.value)])
            .range([margin.left, width-margin.right+100]);
      
         let y = d3.scaleLinear()
            .domain([top_n, 0])
            .range([height-margin.bottom/5, margin.top]);
      
         let xAxis = d3.axisTop()
            .scale(x)
            .ticks(width > 500 ? 5:2)
            .tickSize(-(height-margin.top-margin.bottom))
            .tickFormat(d => d3.format(',')(d));
      
         svg.append('g')
           .attr('class', 'axis xAxis')
           .attr('transform', `translate(0, ${margin.top})`)
           .call(xAxis)
           .selectAll('.tick line')
           .classed('origin', d => d == 0);
      
         svg.selectAll('rect.bar')
            .data(yearSlice, (d) => {d.name;})
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', x(0)+1)
            .attr('width', d => {x(d.value)-x(0)-1;})
            .attr('y', d => y(d.rank)+5)
            .attr('height', y(1)-y(0)-barPadding)
            // .style('fill', d => d.colour)
            .style('fill', d => colorScale(d["name"]));
          
         svg.selectAll('text.label')
            .data(yearSlice, d => d.name)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
            .style('text-anchor', 'end')
            .html(d => d.name);
          
        svg.selectAll('text.valueLabel')
          .data(yearSlice, d => d.name)
          .enter()
          .append('text')
          .attr('class', 'valueLabel')
          .attr('x', d => x(d.value)+5)
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
          .text(d => d3.format(',.0f')(d.lastValue));
    
        let yearText = svg.append('text')
          .attr('class', 'yearText')
          .attr('x', width-margin.right)
          .attr('y', height-25)
          .style('text-anchor', 'end')
          .html(~~year)
          // .call(halo, 10);
         
          // ##################################### Callback for chart updation with d3 format##########################################
          function updateScatter() {
    
          yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
            .sort((a,b) => b.value - a.value)
            .slice(0,top_n);
    
          yearSlice.forEach((d,i) => d.rank = i);
         
    
          x.domain([0, d3.max(yearSlice, d => d.value)]); 
         
          svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);
        

           
           let bars = svg.selectAll('.bar').data(yearSlice, d => d.name);
          
           bars
            .enter()
            .append('rect')
            .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
            .attr('x', x(0)+1)
            .attr( 'width', d => {x(d.value)-x(0)-1;})
            // .attr( 'width', 300)
    
            .attr('y', d => y(top_n+1)+5)
            .attr('height', y(1)-y(0)-barPadding)
            .style('fill', d => colorScale(d["name"]))
            // .style('fill', d => d.colour)
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('y', d => y(d.rank)+5);
              
    
           bars
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('width', d => x(d.value)-x(0)-1)
              .attr('y', d => y(d.rank)+5);
                
           bars
            .exit()
            .transition()
              .duration(800)
              .ease(d3.easeLinear)
              .attr('width', d => x(d.value)-x(0)-1)
              .attr('y', d => y(top_n+1)+665)
              .remove();
    
           let labels = svg.selectAll('.label')
              .data(yearSlice, d => d.name);
         
           labels
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
            .style('text-anchor', 'end')
            .html(d => d.name)    
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
                 
        
              labels
              .transition()
              .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value)-8)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
         
           labels
              .exit()
              .transition()
                .duration(800)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value)-8)
                .attr('y', d => y(top_n+1)+665)
                .remove();
             
    
         
           let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.name);
    
           valueLabels
              .enter()
              .append('text')
              .attr('class', 'valueLabel')
              .attr('x', d => x(d.value)+5)
              .attr('y', d => y(top_n+1)+5)
              .text(d => d3.format(',.0f')(d.lastValue))
              .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
                
           valueLabels
              .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value)+5)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                .tween("text", function(d) {
                   let i = d3.interpolateRound(d.lastValue, d.value);
                   return function(t) {
                     this.textContent = d3.format(',')(i(t));
                  };
                });
          
         
          valueLabels
            .exit()
            .transition()
              .duration(800)
              .ease(d3.easeLinear)
              .attr('x', d => x(d.value)+5)
              .attr('y', d => y(top_n+1)+665)
              .remove();
        
          yearText.html(~~year);

          // $(function () {
          //   $("#yearForSlider2").slider({
          //     range: false,
          //     min: 1960,
          //     max: 2019,
          //     value: year,
          //     slide: function (event, ui) {
          //       year = ui.value;
          //       document.getElementById("yearSelected2").innerText = `${year}`
          //       updateScatter();
          //     }
          //   });
          // });
          // sliderUpdate()

              }
        

     updateScatter();
     sliderUpdate();
     let ticker = d3.interval(
           e => {
                   updateScatter();
                 if(year == 2019) ticker.stop();
                //  yearText.html(~~year);
                 year = d3.format('.2f')((+year) + 0.25);
               //  year = d3.format('.2f')((+year) + 1);
               },
                           tickDuration/5);


      function sliderUpdate() {
          $("#yearForSlider2").slider({
            range: false,
            min: 1960,
            max: 2019,
            value: year,
            slide: function (event, ui) {
              year = ui.value;
              document.getElementById("yearSelected2").innerText = `${year}`
              updateScatter();
            }
          });
        }






    //  const halo = function(text, strokeWidth) {
    //   text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
    //     .style('fill', '#ffffff')
    //      .style( 'stroke','#ffffff')
    //      .style('stroke-width', strokeWidth)
    //      .style('stroke-linejoin', 'round')
    //      .style('opacity', 1);}  
         });

         
        }
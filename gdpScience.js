

function gdpScience() {

    var tickDuration = 900;
    
    let year = 1970;
    
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


  const Y_VARS = {
    "Foreign direct investment, net inflows (BoP, current US$)": true,
    "Total Patents": false,
    "Exports of goods and services (BoP, current US$)": false,
    "Foreign direct investment, net (BoP, current US$)": false,
    
    "Trademark applications, total": false,
  }

  d3.select("#yVar")
  .selectAll("*").remove()

  function createDropdown() {
    const select = document.getElementById("yVar");
    Object.keys(Y_VARS).forEach((yVar) => {
      const option = document.createElement("option");
      option.text = option.value = yVar;
      select.add(option);
    })
  }
  createDropdown();

  

  function allToFloat(data) {
    data.map(d => {
      for (const key in d) d[key] = !isNaN(parseFloat(d[key])) ? parseFloat(d[key]) : d[key];
      if ([1970, 1980, 1990].includes(d["Year"])) {
        for (const key in d) {
          if (key === "Year") continue;
          if (typeof d[key] === 'number') {
            d[key] = d[key] / 2;
          }
        }
      }
      return d;
    });
    return data;
  }
                // append the svg object to the body of the page
                // https://raw.githubusercontent.com/geetkalra/weblab/master/gdpScience.csv
                // https://raw.githubusercontent.com/6859-sp21/final-project-india_economichistory/main/gdpScience_noContinents.csv
                // https://raw.githubusercontent.com/geetkalra/weblab/master/augmented_gdpScience_rosling.csv                           
d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-india_economichistory/main/gdpScience_noContinents.csv").then((gdpScience) => {
  gdpScience = allToFloat(gdpScience);
  const g7Countries = ['India','China']
  // Setting parameters
  
  let popMin = 10000, popMax = 1000000000;
  let xVar = "GDP";
  let yVar = Y_VARS[0];
 
  let country = "India";

  // Setting up variables that describe chart space
  const margin = ({ top: 10, right: 20, bottom: 50, left: 50 });

  // Create scatterplot SVG
  const colorScale = (countryName) => d3.schemeTableau10[g7Countries.includes(countryName) ? 1 : 0]

  const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

 

  // Initialize points
  const symbol = d3.symbol();
  const g = svg.append('g');

  // Initialize x-axis
  let xScale = d3.scaleLog()
                .domain([10000000, d3.max(gdpScience, d => d[xVar])])
                // .domain(d3.extent(gdpScience, d => d[xVar]))
                .range([height - margin.bottom, margin.top])
                .nice();
  const xAxisG = svg.append('g')
                     .attr('transform', `translate(${margin.left + 0}, 0)`);
  const xAxisText = xAxisG.call(d3.axisLeft(xScale))
                          .append('text');

    

  // Initialize y-axis
  let yScale = d3.scaleLog()
                  .domain([1, d3.max(gdpScience, d => d[yVar])])
                  .range([margin.left, width - margin.right])
                  .nice();
  const yAxisG = svg.append('g')
                    .attr('transform', `translate(0, ${height - margin.bottom})`);
                    
  const yAxisText = yAxisG.call(d3.axisBottom(yScale).tickFormat(d3.format(".1s")))
                          .append('text');


   // Add year background label
  //  const yearLabel = svg.append('text');

  let yearText = svg.append('text')
  .attr('class', 'yearText')
  .attr('x', 700)
  .attr('y', height - margin.bottom - 100)
  // .style('text-anchor', 'end')
  .html(~~year)
  // .call(halo, 10);

  function updateScatter() {
    yVar = document.getElementById("yVar").value;
    const data = gdpScience.filter(d => d["Year"] === year && d[xVar] >= 1 && d[yVar] >= 1);

    // Draw x-axis
    xScale = d3.scaleLog()
      // .domain([10000000, d3.max(gdpScience, d => d[xVar])])
      .domain([10000000, 1e+17])
      .range([height - margin.bottom, margin.top])
      .nice();
    xAxisG.call(d3.axisLeft(xScale));
    xAxisText
      .attr('transform', `translate(20, ${margin.top}) rotate(-90)`)
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('GDP($)');


    yScale = d3.scaleLinear()
        .domain([d3.min(gdpScience, d => d[yVar]), d3.max(gdpScience, d => d[yVar])])
        .range([margin.left, width - margin.right])
        .nice();
    yAxisG.call(d3.axisBottom(yScale).tickFormat(d3.format(".1")));
    yAxisText
        .attr('transform', `translate(0, 0)`)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('x', width + margin.right)
        .attr('y', -10)
        .text(yVar);


    // Draw points
    g
      .selectAll('path')
      .data(data, console.log('dataformat in rosling',data))
      .join('path')
      .attr('transform', d => `translate(${yScale(d[yVar])}, ${xScale(d[xVar])})`)
      .attr('fill', d => colorScale(d["Country Name"]))
      .attr('d', d => symbol())
      .on("mouseover",function(d,i){
                      console.log(d)
                      d3.select(this).style("opacity",1);
                      d3.select('#tooltip2')
                      // .style("left", xScale(d[xVar]) + "px")     
                      // .style("top", yScale(d[yVar]) + "px")
                      .style('left', (d3.event.pageX + 10)+ 'px')
                      .style('top', (d3.event.pageY - 25) + 'px')
                      .style('display', 'inline-block')
                      .html("Country: " + d["Country Name"] + "<br/>  GDP (US $): " + d[xVar]+"             " + yVar+":" + d[yVar])
                        d3.select(this)
                          .attr("d", symbol.size(64 * 4));
              })
      .on("mouseout", function(d,i) {
                  d3.select(this).style("opacity",1);
                  d3.select('#tooltip2')
                    .style('display', 'none')
                  d3.select(this)
                      .attr("d", symbol.size(64));
              });

              

        // Update the year label on the svg container
        yearText.html(~~year);
        

     
  }
  document.getElementById("yVar").addEventListener("change", updateScatter);
 
 
  updateScatter();
  sliderUpdate();
  let ticker = d3.interval(
        e => {
              updateScatter();
              if(year == 2016) ticker.stop();
              
              year = year + 1;

              // year = d3.format('.1f')((+year) + 0.1);
            },
                        tickDuration/5);


function sliderUpdate() {
  $("#yearForSlider").slider({
    range: false,
    min: 1970,
    max: 2016,
    value: year,
    slide: function (event, ui) {
      year = ui.value;
      document.getElementById("yearSelected").innerText = `${year}`
      updateScatter();
    }
  });
};




  });

 }
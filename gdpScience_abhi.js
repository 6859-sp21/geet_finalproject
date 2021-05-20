

function gdpScience2() {

  var allCountryList = ["Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Dem. Rep.", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cyprus", "Czech Republic", "Dominican Republic", "Ecuador", "Egypt, Arab Rep.", "El Salvador", "Equatorial Guinea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia, The", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong SAR, China", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Rep.", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Rep.", "Kosovo", "Kuwait", "Kyrgyz Republic", "Lao PDR", "Latvia", "Lebanon", "Lesotho", "Liberia", "Lithuania", "Luxembourg", "Macao SAR, China", "Macedonia, FYR", "Madagascar", "Malaysia", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic", "Slovenia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela, RB", "Vietnam", "West Bank and Gaza", "Zambia", "Zimbabwe"]
  var emptyCountryObject = {
    "Country Name": "",
    "Country Code_x": "",
    "Year": 1970,
    "Exports of goods and services (BoP, current US$)": 1,
    "Foreign direct investment, net (BoP, current US$)": 1,
    "Foreign direct investment, net inflows (BoP, current US$)": 1,
    "Foreign direct investment, net outflows (% of GDP)": 1,
    "Foreign direct investment, net outflows (BoP, current US$)": 1,
    "Goods exports (BoP, current US$)": 1,
    "Goods imports (BoP, current US$)": 1,
    "Gross domestic savings (% of GDP)": 1,
    "Gross domestic savings (current US$)": 1,
    "GDP": 1,
    "ICT service exports (% of service exports, BoP)": 1,
    "ICT service exports (BoP, current US$)": 1,
    "Imports of goods and services (BoP, current US$)": 1,
    "Imports of goods, services and primary income (BoP, current US$)": 1,
    "Service exports (BoP, current US$)": 1,
    "Service imports (BoP, current US$)": 1,
    "Country Code_y": "",
    "Charges for the use of intellectual property, payments (BoP, current US$)": 1,
    "Charges for the use of intellectual property, receipts (BoP, current US$)": 1,
    "High-technology exports (% of manufactured exports)": 1,
    "High-technology exports (current US$)": 1,
    "Patent applications, nonresidents": 1,
    "Patent applications, residents": 1,
    "Total Patents": 1,
    "Research and development expenditure (% of GDP)": 1,
    "Researchers in R&D (per million people)": 1,
    "Scientific and technical journal articles": 1,
    "Technicians in R&D (per million people)": 1,
    "Trademark applications, direct nonresident": 1,
    "Trademark applications, direct resident": 1,
    "Trademark applications, total": 1
  }

  var tickDuration = 1000;

  let year = 1970;

  var top_n = 15;
  var margin = { top: 50, right: 80, bottom: 50, left: 80 },
  width = 1000 - margin.left - margin.right,
  height = 950 - margin.top - margin.bottom;
    // width = 0.84 * S_H,
    // height = 0.84 * S_H;
  console.log(width);
  console.log(height);

  var svg = d3.select("#vis2")
    .select("svg")
    // .attr("width", width)
    // .attr("height", height)
    .append("g")
  // .attr("transform",
  //         "translate(" + margin.left + "," + margin.top + ")");


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
    const g7Countries = ['India', 'China'];
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
      .range([height, 0])
      .nice();
    const xAxisG = svg.append('g')
      .attr('transform', `translate(${margin.left + 30}, 0)`);
    const xAxisText = xAxisG.call(d3.axisLeft(xScale))
      .append('text');



    // Initialize y-axis

    let yScale = d3.scaleLinear()
      .domain([d3.min(gdpScience, d => d[yVar]), d3.max(gdpScience, d => d[yVar])])
      .range([margin.left, width - 5 * margin.right])
      .nice();
    const yAxisG = svg.append('g')
      .attr('transform', `translate(80, ${height - margin.bottom})`);

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


    function addEmptyCountryData(data) {
      // Check if all maximum possible country data is available
      if (data.length != allCountryList.length) {
        // Otherwise fill empty objects for each country

        // check all countries in data
        let dataCountries = [];
        data.forEach(e => {
          dataCountries.push(e["Country Name"]);
        })
        console.log(dataCountries);

        allCountryList.forEach(e => {
          // console.log(e);
          if (dataCountries.indexOf(e) == -1) {
            let temp = emptyCountryObject;
            temp["Country Name"] = e;
            data.push(temp);
            // console.log(temp);
          }
        })

        console.log(data);
      }
    }

    function createScatter() {
      yVar = document.getElementById("yVar").value;
      const data = gdpScience.filter(d => d["Year"] === year && d[xVar] >= 1 && d[yVar] >= 1);

      addEmptyCountryData(data);

      // Draw x-axis
      console.log('max X', d3.max(gdpScience, d => d[xVar]))

      xScale = d3.scaleLog()
        // .domain([10000000, d3.max(gdpScience, d => d[xVar])])
        .domain([10000000, 1e+14])
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

      console.log(margin.left)
      console.log(width - margin.right)
      console.log(width - 10 * margin.right)
      console.log('max Y', d3.max(gdpScience, d => d[yVar]))

      yScale = d3.scaleLinear()
        .domain([d3.min(gdpScience, d => d[yVar]), d3.max(gdpScience, d => d[yVar])])
        .range([margin.left, width - 5 * margin.right])
        .nice();
      yAxisG.call(d3.axisBottom(yScale).tickFormat(d3.format(".1")));
      yAxisText
        .attr('transform', `translate(0, 0)`)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('x', width / 2 + margin.right)
        .attr('y', -10)
        .text(yVar);

      // Draw points
      g
        .selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        // .attr('transform', d => `translate(${yScale(d[yVar])}, ${xScale(d[xVar])})`)
        .attr("cx", function (d) {
          return yScale(d[yVar]);  // Circle's X
        })
        .attr("cy", function (d) {
          return xScale(d[xVar]);  // Circle's Y
        })
        .attr("r", 3)
        .attr('fill', d => colorScale(d["Country Name"]))
        // .attr('d', d => symbol())
        .on("mouseover", function (d, i) {
          // console.log(d)
          d3.select(this).style("opacity", 1);
          d3.select('#tooltip2')
            .style("top", xScale(d[xVar]) + 20 + "px")
            .style("left", yScale(d[yVar]) + "px")
            // .style('left', (d3.event.pageX + 10)+ 'px')
            // .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html("Country: " + d["Country Name"] + "<br/>  GDP (Billion US $): " + d[xVar] + "<br/>" + yVar + ":" + d[yVar])
          d3.select(this)
            .attr("d", symbol.size(64 * 4));
        })
        .on("mouseout", function (d, i) {
          d3.select(this).style("opacity", 1);
          d3.select('#tooltip2')
            .style('display', 'none')
          d3.select(this)
            .attr("d", symbol.size(64));
        });

    }

    function updateScatter() {
      // Update the year label on the svg container
      console.log(year);
      yearText.html(~~year);
      document.getElementById("yearSelected").innerText = `${year}`
      const data = gdpScience.filter(d => d["Year"] === year && d[xVar] >= 1 && d[yVar] >= 1);
      console.log(data);
      // var countryArray = []
      // if (year == 2012) {
      //   data.forEach(e => {
      //     countryArray.push(e['Country Name']);
      //   })
      //   console.log(JSON.stringify(countryArray))
      // }

      // Draw points
      g
        .selectAll('circle')
        .data(data)
        .transition()  // Transition from old to new
        .duration(1000)
        // .attr('transform', d => `translate(${yScale(d[yVar])}, ${xScale(d[xVar])})`)
        .attr("cx", function (d) {
          return yScale(d[yVar]);  // Circle's X
        })
        .attr("cy", function (d) {
          return xScale(d[xVar]);  // Circle's Y
        })
        .attr('fill', d => colorScale(d["Country Name"]))

      // .attr('d', d => symbol())

    }
    document.getElementById("yVar").addEventListener("change", updateScatter);

    createScatter()
    let ticker = d3.interval(
      e => {
        sliderUpdate();
        updateScatter();
        if (year == 2016) { ticker.stop(); }

        year = year + 1;


        // year = d3.format('.1f')((+year) + 0.1);
      },
      tickDuration / 2);


    function sliderUpdate() {
      $("#yearForSlider").slider({
        range: false,
        min: 1970,
        max: 2016,
        value: year,
        slide: function (event, ui) {
          if(ticker){ ticker.stop(); }
          year = ui.value;
          document.getElementById("yearSelected").innerText = `${year}`
          updateScatter();
        }
      })

    };




  });

}


//TODO Year text not showing / updating
//TODO data points smoothing
//TODO if auto slide interrupted, should stop
//TODO Restart for auto-slide
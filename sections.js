// <!-- Code adapted from: -->
// <!-- http://bl.ocks.org/larskotthoff/4aeb6299c61a42093562 -->
// <!-- https://bl.ocks.org/sebg/0cc55428f83eb52bdfad6f5692023b07 -->
// <!-- https://stackoverflow.com/questions/64601357/d3-animating-multiple-lines-the-line-cant-be-completed -->
// <!-- https://www.d3-graph-gallery.com/graph/connectedscatter_select.html -->

let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend



drawInitial()

function drawInitial(){
  

    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
                    .attr('opacity', 1);
   
    svg.append('g').append('image').attr('class', 'nehruModi')
    .attr('xlink:href', 'https://raw.githubusercontent.com/geetkalra/weblab/master/manmohanji.png')
    .attr('width', 1000)
    .attr('height', 950)
    .transition().duration(000)
    .attr('opacity', 1)

   
}



// drawInitial_2()


// function drawInitial_2(){
  

//     let svg = d3.select("#vis2")
//                     .append('svg')
//                     .attr('width', 1000)
//                     .attr('height', 950)
//                     .attr('opacity', 0);
   
//     svg.append('g').append('image').attr('class', 'nehruModi')
//     .attr('xlink:href', 'https://raw.githubusercontent.com/geetkalra/weblab/master/nehruModi.png')
//     .attr('width', 1000)
//     .attr('height', 950)
//     .transition().duration(000)
//     .attr('opacity', 0)

   
// }

function draw1(){
    
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    manmohanji()

}

function draw2(){
    // delete(year)
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    barRace()
    
  
}

function draw3(){
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    GDP()
    
  

}

function draw4(){
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    
    GDPPERCAPITA()
    
        
}



function draw5(){
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    // let S_W = window.innerWidth;
    // let S_H = window.innerHeight;
    // gdpScience2()
    gdpScience()
    
  
}

function draw6(){
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    mapplot()
    
  
}
function draw7(){
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    littleGirl()
     
}

function draw8(){
    let svg = d3.select("#vis").select("svg")
    svg.selectAll("*").remove()
    svg.attr('opacity', 0)
    svg.transition().duration(2000).attr('opacity', 1)
    mapplot()
     
}
function draw9(){
    let svg = d3.select("#vis").select("svg")
    // svg.selectAll("*").remove()
    // svg.attr('opacity', 0)
    svg.transition().duration(5000).attr('opacity', 0.5)
    // littleGirl()
     
}


let activationFunctions = [
    draw1,
    draw2,
    draw4,
    draw5,
    draw6,
    draw7,
    draw9,
    draw9,
    draw9
 
]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})
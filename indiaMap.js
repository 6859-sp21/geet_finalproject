function indiaMap(){

let svg = d3.select("#vis2").select("svg")

svg.append('g').append('image').attr('class', 'nehruModi')
.attr('xlink:href', 'https://raw.githubusercontent.com/6859-sp21/final-project-india_economichistory/main/indiaMap.png')
.attr('width', 1000)
.attr('height', 800)
.transition().duration(2000)
.attr('opacity', 1)

}


// https://raw.githubusercontent.com/geetkalra/weblab/master/littleGirl.png
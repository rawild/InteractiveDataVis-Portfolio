/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 5, bottom: 5, left: 5, right: 5 },
  paddingInner = 0.2;

let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  root: null,
  data: [],
  rawData: [],
  selection: null
};


/**
 * LOAD DATA
 * */
d3.csv("../data/senate_25_contributions_Jan_2020.csv", d3.autotype).then(data => {
  state.rawData = data;
  console.log(data)
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const container = d3.select("#d3-container").style("position", "relative");

  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 5)
    .attr("height", 5)
    .style("position", "absolute");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  const uniqueCandidates = [...new Set(state.rawData.map(d => d.Candidate))];
  const nestedData = d3.nest()
     .key(d => d.Candidate)
     .key(d => d.NAME)
     .rollup(v => ({ total: d3.sum(v, d => d['AMOUNT_70']), donations: v }), // reduce function,
      )
     .entries(state.rawData)
  console.log("NestedData", nestedData);

  const yScale = d3
    .scaleBand()
    .domain(uniqueCandidates)
    .range([margin.top, height - margin.bottom])
    .paddingInner(paddingInner);
  
  const xScale = d3
    .scaleLinear()
    .domain(getTheMax(nestedData,uniqueCandidates))
    .range([margin.left, width - margin.right]);
  
    const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20);
  const colorScale = d3
    .scaleOrdinal()
    .domain(uniqueCandidates)
    .range(d3.schemeCategory10);

  
  
  //get keys:
  let keys = [];
  let max = 0
  for (candidate in nestedData){
    if (candidate.values.length > max){
      max = candidate.values.length
    }
  }
  keys = d3.range(0,max)
  
  console.log("keys", uniqueCandidates)
  state.data = d3.stack()
    .keys(keys)(nestedData)
  console.log(state.data)


 // Shape Drawing Code 
  // main svg square
    const svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


  draw(); // calls the draw function
}
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  let filteredData = state.data
  const area = svg
    .selectAll("rect")
    .data(filteredData, d=>d.values)
    .join("rect")
    .attr("x", d => xScale(d.value.total))
    .attr("y", d => yScale(d.value.donations[0].Candidate))
    .attr("width", xScale.bandwidth())
    .attr("height", d => xScale(d[0]-xScale(d[1])))
    .attr("fill", "steelblue")
}

//helper function to get the max of array of values
function getTheMax(nestedData, keys){
  let max = 0
  let array;
  for (j=0; j<keys.length; j++){
    array = nestedData[j].values
    for (i=0; i<array.length;i++){
      if (array[i].value.total > max){
        max = array[i].value.total
      }
    }
  }
  return max
};


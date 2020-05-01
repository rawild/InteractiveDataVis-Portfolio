import { Barchart } from "./BarChart.js";
class BarList {

  constructor(state, setGlobalState) {
    // initialize properties here
    this.width = window.innerWidth * .9;
    this.height = window.innerHeight * 0.8;
    this.margins = { top: 20, bottom: 20, left: 10, right: 20 };
    this.duration = 1000;
    this.format = d3.format(",." + d3.precisionFixed(1) + "f");

    this.svg = d3
      .select("#barlist")
      .append("g")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  draw(state, setGlobalState, removePolitician) {
    d3.selectAll(".barchart").remove()
    // Get the data for the domain
    //console.log("selected", state.selectedPoliticians)
    let filteredData=state.data.filter(d => state.selectedPoliticians.includes(d.Candidate_ID))
    const rollUp = d3.rollups(
      filteredData,
      v => ({ total: d3.sum(v, d => d.Total), donors: v }), // reduce function,
      d => d.Candidate_ID,
    );
    // Get the range of the domain
    console.log('rollUp', rollUp)
    var max = 0
    for (var index in rollUp) {
      if (rollUp[index][1].total > max) {
        max = rollUp[index][1].total
      }
    }
    
    state.domain = [0,max]
    
    console.log("now I am drawing the list");
    console.log("selected length:" + state.selectedPoliticians.length)
    console.log("selected", state.selectedPoliticians)
    if (state.selectedPoliticians.length > 0) {
      let bars = this.svg
        .selectAll("g.listitem")
        .data(state.selectedPoliticians, d=> d)
        .join(
        enter => enter.append("g")
            .attr("class", "listitem")
          .call(enter => enter.transition(.1)),
          update => update,
          exit => exit.remove()
        )
            
        bars
        .each(d => {
          let barchart = new Barchart(state, d, setGlobalState, removePolitician)
          barchart.draw(state)
        })
    
        d3.select("#hover-content")
        .attr("style","border: solid 5px #000000;")
        .selectAll("div.row")
        .data([1])
        .join("div")
        .attr("class", "row")
        .html(d => `${"Hover over a Donor to get info."}`)
      }
  }

    
}

export { BarList };
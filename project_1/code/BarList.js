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

  draw(state, setGlobalState) {
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
    var max = 0
    for (var index in rollUp) {
      if (rollUp[index][1].total > max) {
        max = rollUp[index][1].total
      }
    }
    //console.log('rollUp', rollUp)
    state.domain = [0,max]
    
    console.log("now I am drawing the list");
    //console.log("selected:" + state.selectedPoliticians)

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
        let barchart = new Barchart(state, d, setGlobalState)
        barchart.draw(state, setGlobalState)
      })
      
    }

    
}

export { BarList };

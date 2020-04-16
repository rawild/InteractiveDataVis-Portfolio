class Barchart {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * .9;
        this.height = window.innerHeight * 0.8;
        this.margins = { top: 20, bottom: 20, left: 20, right: 20 };
        this.duration = 1000;
        this.format = d3.format(",." + d3.precisionFixed(1) + "f");

        this.svg = d3
            .select("#barchart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");
        console.log("selected:" + state.selectedPolitician)
        const filteredData = state.data.filter(d => state.selectedPolitician == d.Candidate_ID);
        //console.log("filteredData", filteredData)
        //const donors = filteredData.map(d => d.Donor)
        const candidates = filteredData.map(d=>d.Candidate_ID)
        let rollUp = d3.rollups(
            filteredData,
            v => ({ total: d3.sum(v, d => d.Total), donors: v }), // reduce function,
            d => d.Candidate_ID,
          );
          console.log("rollup", rollUp)
        var max = 0
        for (var index in rollUp){
            if (rollUp[index][1].total > max) {
                max = rollUp[index][1].total 
            }
        }
        let nested = d3.nest().key(d => d.Candidate_ID).entries(filteredData)
        console.log("nested", nested)
        let xScale = d3
            .scaleLinear()
            .domain([0,max])
            .range([this.margins.left, this.width - this.margins.right]);
        
        let yScale = d3
            .scaleBand()
            .domain([0,d3.max(candidates)])
            .range([0,this.height])

        console.log("yScale - 1",yScale(1))
        //yScale.domain([0,d3.max(filteredData.map(d => d.Total))])
        const barColors = d3.scaleSequential(d3.interpolateTurbo).domain([0,nested[0].values.length])
        var keys = d3.range(0,nested[0].values.length)
        let stackedData = d3.stack().keys(keys).value((d,key) => d.values[key].Total)(nested)
        console.log("stackedData",stackedData)
     
        const bars = this.svg
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", (d,i) => barColors(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("class", "bar")
                .attr("x", d=> xScale(d[0]))
                .attr("y", d => yScale(d.data.values[0].Candidate_ID))
                .attr("height", yScale.bandwidth())
                .attr("width", d => xScale(d[1])-xScale(d[0]))
                
                

        /*bars
          .transition()
          .duration(this.duration)
          .attr(
            "transform",
            d => `translate(${xScale(d.Candidate_ID)}, ${yScale(d.Total)})`
          );*/

        /*bars
          .select("rect")
          .transition()
          .duration(this.duration)
          .attr("width", xScale.bandwidth())
          .attr("height", d => this.height - yScale(d.Total))
          .style("fill",  "purple") 
    
        bars
          .select("text")
          .attr("dy", "-.5em")
          .text(d => ` ${d.Candidate_ID-1}: ${d.Donor}`);*/
    }
}

export { Barchart };

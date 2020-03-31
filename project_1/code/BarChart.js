class Barchart {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 1.2;
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
        console.log("filteredData", filteredData)
        const donors = filteredData.map(d => d.Donor)

        let yScale = d3
            .scaleLinear()
            .domain([0,d3.max(filteredData.map(d => d.Total))])
            .range([this.height - this.margins.top, this.margins.bottom]);
        let xScale = d3
            .scaleBand()
            .domain(donors)
            .range([this.margins.left, this.width - this.margins.right])

        yScale.domain([0,d3.max(filteredData.map(d => d.Total))])
        const barColors = d3.scaleSequential(d3.interpolateTurbo).domain([0,filteredData.length])
        console.log("barColors",barColors(100))
        const bars = this.svg
            .selectAll("rect.bar")
            .data(filteredData)
            .join("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.Donor))
                .attr("y", d=> yScale(d.Total))
                .attr("width", xScale.bandwidth())
                .attr("height", d => yScale(0)-yScale(d.Total))
                .style("fill", (d,i) => barColors(i))
                

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

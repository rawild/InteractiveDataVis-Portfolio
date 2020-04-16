class Barchart {

    constructor(state, politician, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * .9;
        this.height = window.innerHeight * 0.1;
        this.margins = { top: 20, bottom: 20, left: 100, right: 20 };
        this.duration = 1000;
        this.format = d3.format(",." + d3.precisionFixed(1) + "f");
        this.politician = politician 

        this.svg = d3
            .select("#barlist")
            .append("div")
            .attr("class", "barchart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");
        console.log("selected:" + state.selectedPoliticians)
        const filteredData = state.data.filter(d => this.politician == d.Candidate_ID);
        let candidate = state.electedsList.filter(d => this.politician == d.Elected_Id)
        candidate = candidate[0].First_Name + " " + candidate[0].Last_Name
        console.log('candidate', candidate)
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
            .domain(state.domain)
            .range([this.margins.left, this.width - this.margins.right]);
        
        let yScale = d3
            .scaleBand()
            .domain([candidate,candidate])
            .range([0,this.height])

        
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
                
        //Add the yAxis
        const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20);        
        this.svg
          .append("g")
          .attr("class", "axis")
          .attr("transform", `translate(${xScale(0)},0)`)
          .call(yAxis);
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

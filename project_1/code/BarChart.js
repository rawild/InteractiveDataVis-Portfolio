class Barchart {

    constructor(state, politician, setGlobalState, removePolitician) {
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
            console.log('donorsColor',state.donorsColor(10))
        const filteredData = state.data.filter(d => this.politician == d.Candidate_ID);
        let candidate = state.electedsList.filter(d => this.politician == d.Elected_Id)
        candidate = candidate[0].First_Name + "\n" + candidate[0].Last_Name
    
    
        let nested = d3.nest().key(d => d.Candidate_ID).entries(filteredData)
        console.log("nested", nested)

        let yScale = d3
            .scaleBand()
            .domain([candidate, candidate])
            .range([0, this.height])
        let xScale = d3
            .scaleLinear()
            .domain(state.domain)
            .range([this.margins.left, this.width - this.margins.right]);

        //yScale.domain([0,d3.max(filteredData.map(d => d.Total))])
        //const barColors = d3.scaleSequential(d3.interpolateTurbo).domain([0, nested[0].values.length])
        var keys = d3.range(0, nested[0].values.length)
        let stackedData = d3.stack().keys(keys).value((d, key) => d.values[key].Total)(nested)
        console.log("stackedData",stackedData)

        const bars = this.svg
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", (d) => state.donorsColor(d[0].data.values[d.index].Cluster_ID))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(candidate))
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d[1]) - xScale(d[0]))
            .on("mouseover", d =>{
                setGlobalState({ hover: {
                    "Donor" : d[0].data.values[d.index].Donor,
                    "Average Donation" : parseInt(d[0].data.values[d.index].Contribution_Avg),
                    "Total Donated to All Campaigns" : d[0].data.values[d.index].Total,
                    "Number of Donations Overall" : d[0].data.values[d.index].Count
                }})
              })
        //Add the yAxis
        const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);
        

        this.svg
            .append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${xScale(0)},${yScale(candidate)})`)
            .call(yAxis)
            .selectAll(".tick text")
                .call(wrap, 100, this.politician)
        
        // adapted from mbostock: https://bl.ocks.org/mbostock/7555321
        function wrap(text, width, politician) {
            text.each(function () {
                var text = d3.select(this),
                words = text.text().split(/\n+/).reverse(),
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null)
                    .append("tspan")
                    .attr("x", -10)
                    .attr("y", y)
                    .attr("dy", dy + "em")
                    .attr("class", "heavy");
                
                let firstName = words.pop()
                line.push(firstName);
                tspan.text(line.join(" "));
                tspan.text(line.join(" "));
                line = [firstName];
                tspan = text.append("tspan")
                        .attr("x", -10)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(words.pop());
                    
                
                text.append("tspan")
                    .attr("class","deleteButton")
                    .attr("x", -10)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * .3 + dy + "em")
                    .text("-")
                    .on("click", () => {
                        removePolitician(politician)
                    })
            })
        }
    }

    draw(state) {
        console.log("now I am drawing my graph for " + this.politician);
        console.log("state", state)
        hoverData = Object.entries(state.hover);
        if (hoverData[0][1] != null){
            color = colorScale(state.hover['Bernie Donors'])
            d3.select("#hover-content")
            .attr("style","border: solid 12px "+ color +";")
            .selectAll("div.row")
            .data(hoverData)
            .join("div")
            .attr("class", "row")
            .html(
                d =>
                // each d is [key, value] pair
                d[1] // check if value exist
                    ? `${d[0]}: ${d[1]}` // if they do, fill them in
                    : null // otherwise, show nothing
            );
        }
    }
}

export { Barchart };

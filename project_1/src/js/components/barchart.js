import Component from '../lib/component.js';
import store from '../store/index.js';

export default class BarChart extends Component {
    
    // Pass our store instance and the HTML element up to the parent Component
    constructor(politician, max) {
        super({
            store,
            element: d3.select("g.listitem"),
        });
        this.local = {
            width: window.innerWidth * .9,
            height: window.innerHeight * 0.1,
            margins: { top: 20, bottom: 20, left: 100, right: 20 },
            duration: 1000,
            format: d3.format(",." + d3.precisionFixed(1) + "f"),
            politician: politician,
            max: max
        }
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let self = this;
        //console.log("self.politician",self.local.politician)
        let bar = self.element.append("div")
            .attr("class", "barchart")
            .append("svg")
            .attr("width", self.local.width)
            .attr("height", self.local.height)
        
        const filteredData = store.state.data.filter(d => self.local.politician == d.Candidate_ID);
        let candidate = store.state.electeds.filter(d => self.local.politician == d.Elected_Id)
        candidate = candidate[0].First_Name + "\n" + candidate[0].Last_Name
    
    
        let nested = d3.nest().key(d => d.Candidate_ID).entries(filteredData)
       // console.log("nested", nested)

        let yScale = d3
            .scaleBand()
            .domain([candidate, candidate])
            .range([0, self.local.height])
        let xScale = d3
            .scaleLinear()
            .domain([0,self.local.max])
            .range([self.local.margins.left, self.local.width - self.local.margins.right]);

        //yScale.domain([0,d3.max(filteredData.map(d => d.Total))])
        //const barColors = d3.scaleSequential(d3.interpolateTurbo).domain([0, nested[0].values.length])
        var keys = d3.range(0, nested[0].values.length)
        let stackedData = d3.stack().keys(keys).value((d, key) => d.values[key].Total)(nested)

        /*const bars = bar
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", (d) => store.state.donorsColor(d[0].data.values[d.index].Cluster_ID))
            .attr("id", d => {
                d[0].data.values[d.index].Cluster_ID + "-" + d[0].data.values[d.index].Candidate_ID
            })
            .on("click", d => {
                console.log("d",d)
                store.dispatch('updateDonor', { 
                    "Donor" : d[0].data.values[d.index].Donor,
                    "Average Donation" : parseInt(d[0].data.values[d.index].Contribution_Avg),
                    "Total Donated to All Campaigns" : d[0].data.values[d.index].Total,
                    "Number of Donations Overall" : d[0].data.values[d.index].Count
                })
             })
             
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(candidate))
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d[1]) - xScale(d[0]))
            .on("mouseover", d => {
                //console.log(d)
                let id = d[0].data.values[d.index].Cluster_ID + "-" + d[0].data.values[d.index].Candidate_ID
                d3.select("#"+id)
                   .attr("class","barHighlighted")                
            })
            //.on("mouseout", handleMouseOut);
            */

           const bars = bar
            .selectAll("rect")
            .data(stackedData)
            .join("rect")
            .attr("fill", (d) => store.state.donorsColor(d[0].data.values[d.index].Cluster_ID))
            .attr("class", d => {
                return "donor" + d[0].data.values[d.index].Cluster_ID 
            })
            .on("click", d => {
                let id = "donor"+ d[0].data.values[d.index].Cluster_ID 
                
                store.dispatch('updateDonor', { 
                    "Donor" : d[0].data.values[d.index].Donor,
                    "Average Donation" : parseInt(d[0].data.values[d.index].Contribution_Avg),
                    "Total Donated to All Campaigns" : d[0].data.values[d.index].Total,
                    "Number of Donations Overall" : d[0].data.values[d.index].Count
                })
             })
            .attr("x", d => xScale(d[0][0]))
            .attr("y", d => yScale(candidate))
            .attr("height", () => yScale.bandwidth())
            .attr("width", d => xScale(d[0][1]) - xScale(d[0][0]))
            .on("mouseover", d => {
                let id = "donor"+ d[0].data.values[d.index].Cluster_ID 
                console.log(id)
                d3.selectAll("."+id)
                   .attr("class","barHighlighted")                
            })
            .on("mouseout", d => {
                d3.selectAll(".barHighlighted")
                   .attr("class","donor"+ d[0].data.values[d.index].Cluster_ID)    
            })


        //Add the yAxis
        const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);
        

        bar
            .append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${xScale(0)},${yScale(candidate)})`)
            .call(yAxis)
            .selectAll(".tick text")
                .call(wrap, self.local.politician)
        
        // adapted from mbostock: https://bl.ocks.org/mbostock/7555321
        function wrap(text, politician) {
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
                        store.dispatch("removePolitician", politician)
                    })
            })
        }
    }
};

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
            //width: window.innerWidth * .9,
            //height: window.innerHeight * 0.1,
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
        let list = d3.select(".list")
        let width = list.attr("width")
        let height = 80
        let bar = self.element.append("div")
            .attr("class", "barchart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
        
        const filteredData = store.state.data.filter(d => self.local.politician == d.Candidate_ID);
        let candidate = store.state.electeds.filter(d => self.local.politician == d.Elected_Id)
        candidate = candidate[0].First_Name + "\n" + candidate[0].Last_Name
    
    
        let nested = d3.nest().key(d => d.Candidate_ID).entries(filteredData)
       // console.log("nested", nested)

        let yScale = d3
            .scaleBand()
            .domain([candidate, candidate])
            .range([0, height])
        let xScale = d3
            .scaleLinear()
            .domain([0,self.local.max])
            .range([self.local.margins.left, width - self.local.margins.right]);

        //yScale.domain([0,d3.max(filteredData.map(d => d.Total))])
        //const barColors = d3.scaleSequential(d3.interpolateTurbo).domain([0, nested[0].values.length])
        var keys = d3.range(0, nested[0].values.length)
        let stackedData = d3.stack().keys(keys).value((d, key) => d.values[key].Total)(nested)
        // Build the bar with the stacked data
        const bars = bar
        .selectAll("rect")
        .data(stackedData)
        .join("rect")
        .attr("fill", (d) => store.state.donorsColor(d[0].data.values[d.index].Cluster_ID))
        .attr("class", d => {
            return "donor" + d[0].data.values[d.index].Cluster_ID 
        })
        .attr("donor", (d) => {return d[0].data.values[d.index].Donor})
        .attr("ave", (d) => {return parseInt(d[0].data.values[d.index].Contribution_Avg)})
        .attr("total", (d) => { return d[0].data.values[d.index].Total})
        .attr("count", (d) => { return d[0].data.values[d.index].Count})
        .on("click", d => {  // add the click functionality
            let id = "donor"+ d[0].data.values[d.index].Cluster_ID 
            let donors = []
            d3.selectAll("."+id).each((d) => {
                let donor = {}
                donor["donor"] = d[0].data.values[d.index].Donor
                donor["ave"] = parseInt(d[0].data.values[d.index].Contribution_Avg)
                donor["total"] = d[0].data.values[d.index].Total
                donor["count"] = d[0].data.values[d.index].Count
                donor["candidate"] = d[0].data.key                
                donors.push(donor)
            })
            //console.log('donors',donors)
            store.dispatch('updateDonors', donors)
            })
        .attr("x", d => xScale(d[0][0]))
        .attr("y", d => yScale(candidate))
        .attr("height", () => yScale.bandwidth())
        .attr("width", d => xScale(d[0][1]) - xScale(d[0][0]))
        .on("mouseover", d => {
            let id = "donor"+ d[0].data.values[d.index].Cluster_ID 
            //console.log(id)
            d3.selectAll("."+id)
                .classed("barHighlighted", true)                
        })
        .on("mouseout", d => {
            d3.selectAll(".barHighlighted")
                .classed("barHighlighted", false)    
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
                tspan.on("click", () => {
                    store.dispatch("highlightPolitician", politician)
                })
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

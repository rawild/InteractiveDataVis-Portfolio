import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';
import * as d3array from 'd3-array';

export default class DonorBar extends Component {
    constructor() {
        super({
            store,
            element: d3.select("#figuredonor"),
        });
        this.local = { 
            format: d3.format(",." + d3.precisionFixed(1) + "f"),
            paddingInner : 0.2,
            margin : { top: 20, bottom: 20, left: 300, right:140 },
        }
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let self = this;
        self.element.selectAll("*").remove()
        console.log("donorbar rendering")
        let width = self.element.node().getBoundingClientRect().width
        let height = self.element.node().getBoundingClientRect().height-30
        /* Get the donor bar chart data*/ 
        self.element.append("div")
            .attr("class","header-2")
            .text("Donors who gave more than $500,000")
        let donors = d3array.rollup(store.state.topDonors,  
            v =>  d3.sum(v, d => d.Total),
            d => parseInt(d.Cluster_ID))
        let most = d3array.greatest(donors, ([,sum]) => sum)
        donors = Array.from(donors)
        donors = donors.sort((a,b) => d3.descending(a[1],b[1]))
        let yScale = d3
            .scaleBand()
            .domain(store.state.donorNames.map(d=>d.Name))
            .range(donors.length > 1 ? [self.local.margin.top, height - self.local.margin.bottom]:[self.local.margin.top,60])
            .paddingInner(self.local.paddingInner);
        let xScale = d3
            .scaleLinear()
            .domain([0,most[1]])
            .range([self.local.margin.left, width - self.local.margin.right]);
        let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20).tickValues(store.state.donorNames.map(d=>d.Name));
        let svg = self.element
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        //append rects
        let bars = svg
            .selectAll("g.bar")
            .data(donors)
            .join(
                enter =>
                    enter
                    .append("g")
                    .attr("class", "bar")
                    .call(enter => enter.append("rect"))
                    .call(enter => enter.append("text")),
                    
            update => update,
            exit => exit.remove()
            )
        
        bars
            .attr(
                "transform",
                d => {
                    return `translate(${xScale(0)}, ${yScale(store.state.donorNames.filter( x => x.Cluster_ID == d[0])[0].Name)})`
                }
            )
        bars
            .select("rect")
            .transition()
            .duration(0)
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d[1])- xScale(0))
            .attr("id", d => "donor"+d[0] )

        bars
            .select("text")
            .attr("class","label")
            .attr("dy", yScale.bandwidth()/2+4)
            .attr("x", d=>xScale(d[1])-xScale(0)+10)
            .text(d => `$${self.local.format(d[1])}`)
        
        // append Y axis
        let g = svg.append("g")
            g.attr("class", "axis-left")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(yAxis)
            .select(".domain").remove()
            g.selectAll(".tick text")
            .classed("tick-donors", true)    
        }
    }
   
    

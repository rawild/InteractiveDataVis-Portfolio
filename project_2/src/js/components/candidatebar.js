import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';
import * as d3array from 'd3-array';
import topCandidates from "../../data/top_money_candidate_filings.csv"

export default class CandidateBar extends Component {
    constructor() {
        super({
            store,
            element: d3.select("#figurecandidate"),
        });
        this.local = { 
            format: d3.format(",." + d3.precisionFixed(1) + "f"),
            paddingInner : 0.2,
            margin : { top: 20, bottom: 20, left: 200, right:140 },
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
        console.log("Candidatesbar rendering")
        let width = self.element.node().getBoundingClientRect().width
        let height = self.element.node().getBoundingClientRect().height-30
        /* Get the donor bar chart data*/ 
        self.element.append("div")
            .attr("class","header-2 chart-title")
            .text("Politicians who recieved more than $1,500,000")

        let candidates = d3array.rollup(topCandidates,  
            v =>  d3.sum(v, d => d.Total), // reduce function,
            d => d.Candidate_ID)
  
        let most = d3array.greatest(candidates, ([,sum]) => sum)
        let topIds = [...candidates.keys()]
        let electeds = store.state.electeds.filter(d => topIds.includes(d.Elected_Id))
        candidates = Array.from(candidates)
        candidates = candidates.sort((a,b) => d3.descending(a[1],b[1]))
        electeds.sort(
            (a,b) => d3.descending(candidates.filter(x => x[0] == a.Elected_Id)[0][1],
            candidates.filter(x => x[0] == b.Elected_Id)[0][1]))
        let yScale = d3
            .scaleBand()
            .domain(electeds.map(d=>d.First_Name +" "+ d.Last_Name))
            .range(candidates.length > 1 ? [self.local.margin.top, 
                height - self.local.margin.bottom]:[self.local.margin.top,60])
            .paddingInner(self.local.paddingInner);
        let xScale = d3
            .scaleLinear()
            .domain([0,most[1]])
            .range([self.local.margin.left, width - self.local.margin.right]);
        let yAxis = d3.axisLeft(yScale).tickSize(0)
            .tickPadding(20).tickValues(electeds.map(d=>d.First_Name +" "+ d.Last_Name));
        let svg = self.element
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        //append rects
        let bars = svg
            .selectAll("g.bar")
            .data(candidates)
            .join(
                enter =>
                    enter
                    .append("g")
                    .attr("class", "bar barPol")
                    .call(enter => enter.append("rect"))
                    .call(enter => enter.append("text")),
                    
            update => update,
            exit => exit.remove()
            )
        
        bars
            .attr(
                "transform",
                d => `translate(${xScale(0)}, ${yScale(
                    electeds.filter( x => x.Elected_Id == d[0])[0].First_Name + " " + electeds.filter( x => x.Elected_Id == d[0])[0].Last_Name
                    )})`
            )
        bars
            .select("rect")
            .transition()
            .duration(0)
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d[1])- xScale(0))
            .attr("id", d => "candidate"+d[0] )

        bars
            .select("text")
            .attr("class","label")
            .attr("dy", yScale.bandwidth()/2+5)
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
   
    

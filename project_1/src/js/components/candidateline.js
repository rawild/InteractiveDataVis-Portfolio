import Component from '../lib/component.js';
import store from '../store/index.js';

export default class CandidateLine extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#candidate-line'),
            key: "highlightPolitician"
        });
        this.local = { 
            paddingInner : 0.2,
            margin : { top: 30, bottom: 50, left: 60, right:20 },
            duration : 1000,
            format : d3.format(",." + d3.precisionFixed(1) + "f")
        }
    }
    
    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let self = this;
        self.element.append("div")
            .attr("class", "header-2")
            .text("Donations by Year")
        const candidateYear = store.state.candidateYear
        let polSummary = candidateYear.filter(d => d.Candidate_ID == store.state.highlightPolitician)
        
        polSummary.forEach(d => {
            if (d.Contribution_Year instanceof Date){
                return d.Contribution_Year
            }
            return d.Contribution_Year = new Date(d.Contribution_Year, 0, 1)
        })

        let width = 220
        let height = 150
        let xScale = d3
            .scaleTime()
            .domain(d3.extent(polSummary, d => d.Contribution_Year))
            .range([self.local.margin.left, width - self.local.margin.right]);
        
        let yScale = d3
            .scaleLinear()
            .domain([0,d3.max(polSummary, d=>d.Total)])
            .range([height - self.local.margin.bottom, self.local.margin.top]);
        
        // + AXES
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(polSummary.length);
        const yAxis = d3.axisLeft(yScale).ticks(4)
        
        let svg = self.element.append("svg")
                .attr("width", width)
                .attr("height", height)

        svg
            .append("g")
            .attr("class", "axis-side x-axis-side")
            .attr("transform", `translate(0,${yScale(0)})`)
            .call(xAxis)
            .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)")
 
        svg
            .append("g")
            .attr("class", "axis-side y-axis-side")
            .attr("transform", `translate(${self.local.margin.left},0)`)
            .call(yAxis)
        
       const lineFunc = d3
            .line()
            .x(d => xScale(d.Contribution_Year))
            .y(d => yScale(d.Total));
        
        const line = svg
            .selectAll("path.trend")
            .data([polSummary])
            .join(
              enter =>
                enter
                  .append("path")
                  .attr("class", "trend")
                  .attr("opacity", 0), // start them off as opacity 0 and fade them in
              update => update, // pass through the update selection
              exit => exit.remove()
            )
            .call(selection =>
              selection
                .transition() // sets the transition on the 'Enter' + 'Update' selections together.
                .duration(1000)
                .attr("opacity", 1)
                .attr("d", d => lineFunc(d))
            );
    
    }
    
}

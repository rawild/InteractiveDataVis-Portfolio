import Component from '../lib/component.js';
import store from '../store/index.js';

export default class CandidateLine extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#candidate-line')
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
        console.log("now I am drawing side ");
        //console.log("state.donors", store.state.donors)
        
        let polSummary = store.state.candidateYear.filter(d => d.Candidate_ID == store.state.highlightPolitician)
        polSummary.forEach(d => {
            d.Contribution_Year = new Date(d.Contribution_Year, 0, 1)
        })
        console.log('polSummary', polSummary)
        let width = 250
        let height = 200
        let xScale = d3
            .scaleTime()
            .domain(d3.extent(polSummary, d => d.Contribution_Year))
            .range([self.local.margin.left, width - self.local.margin.right]);
        
        let yScale = d3
            .scaleLinear()
            .domain([0,d3.max(polSummary, d=>d.Total)])
            .range([height - self.local.margin.bottom, self.local.margin.top]);
        
        // + AXES
        const xAxis = d3.axisBottom(xScale).tickSize(8);
        const yAxis = d3.axisLeft(yScale)

        let svg = self.element.append("svg")
                .attr("width", width)
                .attr("height", height)

        svg
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${yScale(0)})`)
            .call(xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "3em")
            .text("Year");
        svg
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${self.local.margin.left},0)`)
            .call(yAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "10%")
            .attr("x", "35%")
            .attr("dx", "-3em")
            .text("Donations by Year");
        
        /*
        const areaFunc = d3
            .area()
            .x(d=> xScale(d.Contribution_Year))
            .y0(d => yScale(0))
            .y1(d => yScale(d.Total))
        const area = svg
            .selectAll("path.area")
            .data(polSummary, d=>d.Contribution_Year)
            .join("path")
                .attr("class", "area")
                .attr("opacity", 0.7) // start them off as opacity 0 and fade them in
                .attr("d", areaFunc)*/
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
        /*let donors = store.state.donors
        if (donors != null){
        let height= donors.length * 60
        donors = donors.sort((a,b) => d3.descending(a.total, b.total))
        // Scales for visualization
        donors.forEach(d => {
            let candidate = store.state.electeds.filter(elected => d.candidate  == elected.Elected_Id)
            console.log("candidate", candidate)
            d.candidate = candidate[0].First_Name + " " + candidate[0].Last_Name
        })
        self.element.append("p")
            .attr("class", "subHeader")
            .text("Donor Stats: " + store.state.donorPrettyPrint(donors[0].donor))
        
        let yScale = d3
            .scaleBand()
            .domain(donors.map(d => d.candidate
                ).reverse())
            .range(donors.length > 1 ? [self.local.margin.top, height - self.local.margin.bottom]:[self.local.margin.top,60])
            .paddingInner(self.local.paddingInner);
        let xScale = d3
            .scaleLinear()
            .domain([0,d3.max(donors, d => d.total)])
            .range([self.local.margin.left, self.local.width - self.local.margin.right]);
        let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20);
        // Shape Drawing Code 
        // main svg square
        let svg = self.element
            .append("svg")
            .attr("width", self.local.width)
            .attr("height", height);
        //append rects
        let bars = svg
            .selectAll("g.bar")
            .data(donors, d => d.candidate+d.donor)
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
            .transition()
            .duration(self.local.duration)
            .attr(
                "transform",
                d => `translate(${xScale(0)}, ${yScale(d.candidate)})`
            )
        bars
            .select("rect")
            .transition()
            .duration(self.local.duration)
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d.total)- xScale(0))

        bars
            .select("text")
            .attr("class","label")
            .attr("dy", yScale.bandwidth()/2 -8 )
            .attr("x", d=>xScale(d.total)-xScale(0)+10)
            .text(d => `$${self.local.format(d.total)} total`)
            .append("tspan")
            .attr("x", d=>xScale(d.total)-xScale(0)+10)
            .attr("dy", "1.5em")
            .text(d=> `in ${d.count} donations`)
        
        // append Y axis
        svg
            .append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(yAxis);    
        }*/
    }
    
}

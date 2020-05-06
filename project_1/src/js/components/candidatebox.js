import Component from '../lib/component.js';
import store from '../store/index.js';

export default class CandidateBox extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#candidate-box')
        });
        this.local = { 
            width : window.innerWidth * 0.65,
            paddingInner : 0.2,
            margin : { top: 10, bottom: 40, left: 150, right:140 },
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
        self.element.selectAll("*").remove()
        
        let politician = store.state.electeds.filter(elected => elected.Elected_Id == store.state.highlightPolitician)[0]
        console.log("politician", politician)
        let imagebox = self.element.append("div")
            .attr("class","image-box")
            imagebox.append("img")
            .attr("src", "../data/img/a"+politician.District+".png")
            .attr("width", "150px")
        

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

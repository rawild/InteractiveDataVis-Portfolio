import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';


export default class CorruptNetwork extends Component {
    constructor() {
        super({
            store,
            element: d3.select("#corruption"),
        });
        this.local = { 
            format: d3.format(",." + d3.precisionFixed(1) + "f"),
            paddingInner : 0.2,
            duration : 1000,
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
        console.log("corrupt tree rendering")
        let width = self.element.node().getBoundingClientRect().width
        let height = self.element.node().getBoundingClientRect().height-50

        /* Get the donor bar chart data*/ 
        self.element.append("div")
            .attr("class","header-2")
            .text("Explore Cuomo's $890K from 90 Healthcare Organizations")
        self.element.append("div")
            .text("You can move the donors around if they get in the way.")
        
        let donorColors = d3.scaleSequential(d3.interpolatePuBu).domain([0, 90])
        

        /* Tree adapted from: M Bostock - https://observablehq.com/@d3/force-directed-tree */
        let root = d3
            .hierarchy(store.state.cuomoDonors) // children accessor, tell it to grab the second element
        let links = root.links()
        let nodes = root.descendants()
        console.log("nodes", nodes)
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(150).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        // Tool tip adapted from: https://observablehq.com/@sethuram975351/force-directed-tree-with-zoom-and-tooltip-addons
        let Tooltip = self.element
            .append("div")
            .attr("class", "tooltip")
            .style("font-size","14px")
            .style("pointer-events","none");

        let mouseover = (d)=>{
            d3.select("#circle"+d.index)
                .transition()
                .duration(self.local.duration)
                .attr("r", d=>d.children?10:d.data.total/750)
            Tooltip.transition()
                .duration(self.local.duration)
                .style("opacity", 1);

            Tooltip.html(()=>{
                let innerTableContent;
                if(d.children){
                    innerTableContent =
                        "<tr>"+
                        "<th scope='row'>"+d.data.name+"</th><td> recieved $"+self.local.format(d.data.total)+"</td>"+
                        "</tr>"

                }else{
                    innerTableContent =
                    "<tr>"+
                    "<th scope='row'>"+d.data.name+"</th>"+ "<td> paid Cuomo $"+self.local.format(d.data.total)+"</td>"+
                    "</tr>"
                }
                return "<div class='card bg-dark'>"+"<div class='card-body'>"+
                    "<table class='table table-striped table-dark'>"+
                    "<tbody>"+
                    innerTableContent +
                    "</tbody>" +
                    "</table>"+
                    "</div></div>";
            }).style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 200) + "px");
        };

        let mouseout = (d) => {
            d3.select("#circle"+d.index)
                .transition()
                .duration(self.local.duration)
                .attr("r", d=>d.children?10:d.data.total/1000)
            Tooltip.transition()
                .duration(self.local.duration)
                .style("opacity", 0);
        };
        
        
        let svg = self.element
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height]);
        
        let link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
                .data(links)
                .join("line");
        
        const node = svg.append("g")
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 2.5)
            .style("cursor", "pointer")
            .selectAll("circle")
                .data(nodes)
                .join("circle")
                    .attr("fill", d => d.children ? null : donorColors(90-d.index))
                    .attr("stroke", d => d.children ? null : "#000")
                    .attr("r", d => d.children ? 10 : d.data.total/1000)
                    .attr("id",d=>"circle"+d.index)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .call(drag(simulation));


        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        })
        
        function drag(simulation) {

            function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            }
            
            function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            }
            
            function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            }
            
            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
        
    }
}
        
   
    

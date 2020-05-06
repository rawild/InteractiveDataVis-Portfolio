import Component from '../lib/component.js';
import store from '../store/index.js';
import BarChart from './barchart.js';

export default class BarList extends Component {
    
    // Pass our store instance and the HTML element up to the parent Component
    constructor() {
        super({
            store,
            element: d3.select("#barlist")
        });
        this.local = {
            margins: { top: 20, bottom: 20, left: 10, right: 20 },
            duration: 1000,
            format: d3.format(",." + d3.precisionFixed(1) + "f")
        }
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let self = this;
        self.element.html("")
        let width = self.element.node().getBoundingClientRect().width
        let height = self.element.node().getBoundingClientRect().height
        let list=self.element.append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "list")

        
        console.log("now I am drawing the list");

        if (store.state.selectedPoliticians.length > 0) {
            let filteredData=store.state.data.filter(d => store.state.selectedPoliticians.includes(d.Candidate_ID))
            const rollUp = d3.rollups(
                filteredData,
                v => ({ total: d3.sum(v, d => d.Total), donors: v }), // reduce function,
                d => d.Candidate_ID,
            );
            var max = 0
            for (var index in rollUp) {
                if (rollUp[index][1].total > max) {
                    max = rollUp[index][1].total
                }
            }
            let bars = list
                .selectAll("g.listitem")
                .data(store.state.selectedPoliticians, d=> d)
                .join("g")
                    .attr("class", "listitem")
   
            bars
                .each(d => {
                let barchartInstance = new BarChart(d, max)
                barchartInstance.render()
                })
        }
    }

}

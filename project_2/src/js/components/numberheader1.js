import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';

export default class NumberHeader extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#number-header'),
            key: "summary"
        });
        this.local = { 
            format: d3.format(",." + d3.precisionFixed(1) + "f"),
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
            .attr("class","number bottom")
            .html(`<span class="big">$${self.local.format(store.state.summary.total_money)} </span> 
            <div class="middle-text">
                in <br> 
                donations <br>
                from </div> 
            <span class="big"> ${self.local.format(store.state.summary.total_donors)} </span> 
            <div class="end-text">donors</div>`
            )
        self.element.append("div")
            .attr("class","number bottom")
            .html(`<span class="bigger-end-text"> to </span> 
            <span class="bigger">${store.state.summary.total_candidates} </span> 
            <span class="bigger-middle-text">candidates <br>over</span>
            <span class="bigger">5</span> 
            <span class="bigger-end-text">years</span>`)


    }
   
    
}
import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';

export default class SidePanel extends Component {
    constructor(value) {
        super({
            store,
            element: d3.select("[data-step =\"" +value+"\" ]")
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
    render(header, body, titleClass, bodyClass) {
        let self = this;
        //console.log(self.element)
        self.element.insert("div", ":first-child")
            .attr("class","side-panel "+bodyClass)
            .html(`${body}`)
        self.element.insert("div",":first-child")
            .attr("class","header-2 article-title "+titleClass)
            .text(header)
        
    }
   
    
}
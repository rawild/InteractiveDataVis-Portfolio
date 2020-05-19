import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';

export default class Header extends Component {
    constructor(element) {
        super({
            store,
            element: element,
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
    render(text) {
        let self = this;

        self.element.append("div")
            .attr("class","header-1")
            .text(text)
    }
   
    
}
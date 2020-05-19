import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';
import Header from './header.js';


export default class SectionHeader extends Component {
    constructor(id) {
        super({
            store,
            element: d3.select("#" +id),
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
    render(headertext,text) {
        let self = this;
        let div = self.element.append("div")
        let header = new Header(div)
        header.render(headertext)
        self.element.append("div")
            .html(`${text}`)
    }
   
    
}
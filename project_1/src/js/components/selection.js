import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Selection extends Component {
    constructor() {
        super({
            store,
            element: d3.select("#addDropdown")
        });
    }
    
    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let self = this;
        let selectElement=self.element
        selectElement.on("change", () => {
            console.log("new politician", selectElement.node().value)
            store.dispatch("addPolitician", parseInt(selectElement.node().value))
            store.processCallbacks()
        })
        selectElement.append("optgroup")
            .attr("label","Select a Politician")
        
        selectElement
            .selectAll("option")
            .data(store.state.electeds) // + ADD DATA VALUES FOR DROPDOWN
            .join("option")
            .attr("value", d => d.Elected_Id)
            .text(d => d.First_Name +" "+d.Last_Name)
        }
}

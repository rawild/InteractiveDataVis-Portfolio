import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Selection extends Component {
    constructor() {
        super({
            store,
            element: d3.select("#addDropdown"),
            key: "electeds"

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
            store.processCallbacks(store.state, "selectedPoliticians")
        })
       let groupedPols = d3.groups(store.state.electeds, d => d.County)
        console.log("group",groupedPols)
        selectElement
            .selectAll("optgroup")
                .data(groupedPols)
                .join("optgroup")
                .attr("label", d=>d[0])
            .selectAll("option")
                .data(d=>d[1].sort((a,b)=>{
                    if (a.First_Name.toUpperCase() < b.First_Name.toUpperCase()){
                        return -1
                    }
                    return 1
                })) 
                .join("option")
                .attr("value", d => d.Elected_Id)
                .text(d => {
                    let prefix = d.Role == "Senate"?"Sen.":d.Role == "Assembly"?"Assm.":""
                    return prefix+" "+d.First_Name +" "+d.Last_Name}
                )
            }
}

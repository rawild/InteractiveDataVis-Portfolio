import Component from '../lib/component.js';
import store from '../store/index.js';

export default class BottomContent extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#bottom-content')
        });
    }
    
    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let self = this;
        console.log("now I am drawing bottom ");
        console.log("state.donor", store.state.donor)
        let donorData = store.state.donor ? Object.entries(store.state.donor) : null;
        console.log("donorData", donorData)
        if (donorData != null){
            self.element
            .attr("style","border: solid 12px  #ffffff;")
            .selectAll("div.row")
            .data(donorData)
            .join("div")
            .attr("class", "row")
            .html(
                d =>
                // each d is [key, value] pair
                d[1] // check if value exist
                    ? `${d[0]}: ${d[1]}` // if they do, fill them in
                    : null // otherwise, show nothing
            );
        }
    }
    
}

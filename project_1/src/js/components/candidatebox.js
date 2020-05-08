import Component from '../lib/component.js';
import store from '../store/index.js';
import CandidateLine from './candidateline.js'

export default class CandidateBox extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#candidate-box'),
            key: "highlightPolitician"
        });
        this.local = { 
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
        self.element.html("")
        //catch empty state
        if (store.state.highlightPolitician == null || store.state.highlightPolitician.length == 0){
            return
        }

        let politician = store.state.electeds.filter(elected => elected.Elected_Id == store.state.highlightPolitician)[0]
        let polSummary = store.state.candidateYear.filter(d => d.Candidate_ID == store.state.highlightPolitician)
        // Add District header
        self.element.append("div")
            .attr("class", "header-1")
            .text(politician.Role + " District "+ politician.District)
        self.element.append("div")
            .attr("class", "sub-header")
            .text("Counties: "+politician.Counties)
        // District Image
        let imagebox = self.element.append("div")
            .attr("class","image-box")
        imagebox.append("img")
            .attr("src", "../data/img/a"+politician.District+".png")
            .attr("width", "150px")
        // Politician Details
        self.element.append("div")
            .attr("class", "header-1")
            .text(politician.First_Name + " " + politician.Last_Name)

        let polRollUp = d3.rollups(
            polSummary,
            v => ({ 
                "Total Money Received" : d3.sum(v, d => d.Total), 
                "Average Donation" : d3.mean(v, d => d.Contribution_Avg),
                "Number of Donors" : d3.sum(v, d => d.Donor_Count),
                "Maximum Donation" : d3.max(v, d => d.Contribution_Max)
             }), 
            d => d.Candidate_ID,
        );

        self.element.selectAll("div.subHeader")
            .data(Object.entries(polRollUp[0][1]))
            .join("div")
            .attr("class","subHeader")
            .text(d => {
                if (d[0] != "Number of Donors"){
                    return d[0] + ": $" + d3.format(self.local.format)(d[1])
                }
                return d[0] + ": " + d3.format(self.local.format)(d[1])
            })
        self.element.append("div")
            .attr("id","candidate-line")
        let candidateLineInstance = new CandidateLine()
        candidateLineInstance.render()

        
    }
    
}

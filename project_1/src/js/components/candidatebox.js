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
        
        // District Image
        
        let imagebox = self.element.append("div")
            .attr("class","image-box")
        imagebox.append("img")
            .attr("src", () => {
                if (politician.Role == "Assembly"){
                    return "../data/img/a"+politician.District+".png"
                }
                if (politician.Role == "Senate"){
                    return "../data/img/s"+politician.District+".png"
                }
                return "../data/img/state.png"
            })
            .attr("width", "150px")
        // Add District header
        self.element.append("div")
            .attr("class", "header-1")
            .text(politician.First_Name + " " + politician.Last_Name)
        self.element.append("div")
            .attr("class", "subHeader")
            .text(politician.Role + " District "+ politician.District)
        self.element.append("div")
            .attr("class", "subHeader")
            .text("Counties: "+politician.County)
        self.element.append("div")
            .attr("class", "subHeader")
            .text(politician["SpecialPosition"]!=null?"Special Postion: "+politician["SpecialPosition"]:"")

        let polRollUp = d3.rollups(
            polSummary,
            v => ({ 
                "Total" : d3.sum(v, d => d.Total), 
                "Average" : d3.mean(v, d => d.Contribution_Avg),
                "NumDonors" : d3.sum(v, d => d.Donor_Count),
                "MaxDonation" : d3.max(v, d => d.Contribution_Max)
             }), 
            d => d.Candidate_ID,
        );
        console.log(polRollUp)
        self.element.selectAll("div.statsParagraph")
            .data(polRollUp)
            .join("div")
            .attr("class","statsParagraph")
            .html(d => { console.log(d)
                return `${politician.First_Name} has raised <b>$${d3.format(self.local.format)(d[1].Total)}</b> 
                since 2015 from <b>${d[1].NumDonors}</b> donors with an average 
                donation of <b>$${d3.format(self.local.format)(d[1].Average)}</b>. The biggest donor gave 
                <b>$${d3.format(self.local.format)(d[1].MaxDonation)}</b>.`
            })
        self.element.append("div")
            .attr("id","candidate-line")
        let candidateLineInstance = new CandidateLine()
        candidateLineInstance.render()

        
    }
    
}

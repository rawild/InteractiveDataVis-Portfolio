// import our components
import { Barchart } from "./Barchart.js";

let table, barchart, count, default_selection;

// global state
let state = {
    data: [],
    electedsList: [],
    rollUp: [],
    selectedPolitician: null,
    donorsColor: []
};
Promise.all(["../data/summarized_filings_1.csv",
"../data/Electeds_List.csv"
]).then(function(files) {
    d3.csv(files[0], d3.autoType).then(data => {
        console.log("data", data);
        state.data = data;
        d3.csv(files[1], d3.autoType).then(electeds => {
            console.log("electeds", electeds)
            state.electedsList = electeds
            init();
        })
    })
});


function init() {
    default_selection = "1" // Default to Cuomo
    const selectElement = d3.select("#polDropdown").on("change", function () {
        state.selectedPolitician = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
        console.log("new value is", this.value);
        draw(); // re-draw the graph based on this new selection
    });
    // add in dropdown options from the unique values in the data
    selectElement
        .selectAll("option")
        .data(
            state.electedsList) // + ADD DATA VALUES FOR DROPDOWN
        .join("option")
        .attr("value", d => d.Elected_Id)
        .text(d => d.First_Name +" "+d.Last_Name);
    //Donors Color
    //SET SELECT ELEMENT'S DEFAULT VALUE (optional)
    selectElement.property("value", default_selection);
    state.selectedPolitician = default_selection
    /*const rollUp = d3.rollups(
        state.data,
        v => ({ total: d3.sum(v, d => d.Total), donors: v }), // reduce function,
        d => d.Candidate_ID,
      );
    // Get the range of the domain
    state.rollUp = rollUp
    console.log("rollUp",rollUp)
    var max = 0
    for (var index in rollUp.filter(d.Candidate_ID==default_selection)){
        if (rollUp[index][1].total > max) {
            max = rollUp[index][1].total 
        }
    }
  
    state.domain = [0,max]*/
    barchart = new Barchart(state, setGlobalState);
    draw();
}

function draw() {
    barchart.draw(state, setGlobalState);
}

// From Demo UTILITY FUNCTION: State updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
    state = { ...state, ...nextState };
    console.log("new state:", state);
    draw();
}

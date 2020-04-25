// import our components
import { BarList } from "./BarList.js";

let barList, default_selection;

// global state
let state = {
    data: [],
    electedsList: [],
    rollUp: [],
    selectedPoliticians: [],
    donorsColor: [],
    domain: [0,0],
};
Promise.all(["../data/summarized_filings_2.csv",
"../data/Electeds_List.csv"
]).then(function(files) {
    d3.csv(files[0], d3.autoType).then(data => {
        //console.log("data", data);
        state.data = data;
        d3.csv(files[1], d3.autoType).then(electeds => {
            console.log("electeds", electeds)
            state.electedsList = electeds
            init();
        })
    })
});


function init() {
    default_selection = "" 
    //state.selectedPoliticians.push(default_selection)
    const selectElement = d3.select("#addDropdown").on("change", function () {
        state.selectedPoliticians.push(parseInt(this.value))
        draw()
    });
    // add in dropdown options from the unique values in the data
    selectElement.append("optgroup")
    .attr("label","Select a Politician")
    
    selectElement
        .selectAll("option")
        .data(state.electedsList) // + ADD DATA VALUES FOR DROPDOWN
        .join("option")
        .attr("value", d => d.Elected_Id)
        .text(d => d.First_Name +" "+d.Last_Name);
    //Donors Color
    //SET SELECT ELEMENT'S DEFAULT VALUE (optional)
    selectElement.property("value", default_selection);
    //state.selectedPoliticians = [default_selection]
    
    barList = new BarList(state, setGlobalState)
    draw();
}

function draw() {
    barList.draw(state, setGlobalState,removePolitician)
}

// From Demo UTILITY FUNCTION: State updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
    state = { ...state, ...nextState };
    console.log("new state:", state);
    draw();
}

function removePolitician(politician){
    console.log("recieved politician",politician)
    let selectedPoliticians = state.selectedPoliticians.filter(d => d != politician)
    setGlobalState({"selectedPoliticians" : selectedPoliticians})
}

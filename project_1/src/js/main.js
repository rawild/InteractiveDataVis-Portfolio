/* state management adapted from: https://github.com/hankchizljaw/beedle */
import store from './store/index.js'; 

// Load up components

import BarList  from "./components/barlist.js";
import Selection from "./components/selection.js";
import BottomContent from "./components/bottomcontent.js"
import CandidateBox from "./components/candidatebox.js"

//Load the data
Promise.all(["../data/summarized_filings_2015_20.csv",
"../data/Electeds_List.csv", "../data/candidates_summarized_2015_20.csv"
]).then(function(files) {
    d3.csv(files[0], d3.autoType).then(data => {
        //console.log("data", data);
        store.dispatch('addData', data);
        d3.csv(files[1], d3.autoType).then(electeds => {
            //console.log("electeds", electeds)
            store.dispatch('addElecteds', electeds)
            d3.csv(files[2],d3.autoType).then(candidateYear => {
                store.dispatch('addCandidateYear', candidateYear)
                init()
            })
            
        })
    })
});

function init() {
    // Get global donor color spectrum
    let donors = d3.nest().key(d => d.Cluster_ID).entries(store.state.data)
    store.dispatch('setDonorsColor', d3.scaleSequential(d3.interpolateTurbo).domain([0, donors.length]))
    console.log("hello?")
    // Instantiate components
    const barListInstance = new BarList();
    const selectionInstance = new Selection();
    const bottomInstance = new BottomContent()
    const candidateBox = new CandidateBox()
    
    // Initial renders
    selectionInstance.render()
    bottomInstance.render()
    candidateBox.render()

}
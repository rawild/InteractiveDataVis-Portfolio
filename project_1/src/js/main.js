/* state management adapted from: https://github.com/hankchizljaw/beedle */
import store from './store/index.js'; 

// Load up components

import BarList  from "./components/barlist.js";
import Selection from "./components/selection.js";
import BottomContent from "./components/bottomcontent.js"
import CandidateBox from "./components/candidatebox.js"

//Load the data
Promise.all(["../data/summarized_filings_2017_Jan2022_extraclean.csv",
"../data/Electeds_List.csv", "../data/candidate_summarized_2017_012022_extraclean.csv"
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
    let donors_group = d3.group(store.state.data, d=>d.Cluster_ID)
    let donors_array= [ ...donors_group.keys() ]
    let min = d3.min(donors_array)
    let max = d3.max(donors_array)
    store.dispatch('setDonorsColor', d3.scaleSequential(d3.interpolateTurbo).domain([max, min]))
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
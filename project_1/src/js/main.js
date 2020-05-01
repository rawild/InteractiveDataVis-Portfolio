import store from './store/index.js'; 

// Load up components
/*import Count from './components/count.js';
import List from './components/list.js';
import Status from './components/status.js';
*/
import BarList  from "./components/barlist.js";
import Selection from "./components/selection.js";
import BottomContent from "./components/bottomcontent.js"
// Load up some DOM elements
/*const formElement = document.querySelector('.js-form');
const inputElement = document.querySelector('#new-item-field');

// Add a submit event listener to the form and prevent it from posting back
formElement.addEventListener('submit', evt => {
    evt.preventDefault();
    
    // Grab the text value of the textbox and trim any whitespace off it
    let value = inputElement.value.trim();
    
    // If there's some content, trigger the action and clear the field, ready for the next item
    if(value.length) {
        store.dispatch('addItem', value);
        inputElement.value = '';
        inputElement.focus();
    }
});*/

//Load the data
Promise.all(["../data/summarized_filings_3.csv",
"../data/Electeds_List.csv"
]).then(function(files) {
    d3.csv(files[0], d3.autoType).then(data => {
        //console.log("data", data);
        store.dispatch('addData', data);
        d3.csv(files[1], d3.autoType).then(electeds => {
            //console.log("electeds", electeds)
            store.dispatch('addElecteds', electeds)
            console.log("hello?")
            init()
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

    // Initial renders
    selectionInstance.render()
    bottomInstance.render()
}
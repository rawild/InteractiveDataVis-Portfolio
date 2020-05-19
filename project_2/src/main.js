

// Data
import cuomoDonors from './data/cuomo_healthcare_donors.json'
import topDonors from "./data/top_donor_filings.csv"
import electeds from  "./data/Electeds_List.csv"
import donorNames from "./data/donor_list.csv"
import quartiles from "./data/donor_quartiles.csv"
import donors from './data/donors_summarized_2015_20.csv'

import store from './js/store/index.js'; 
import NumberHeader from "./js/components/numberheader1.js"
import DonorScrolly from "./js/components/donorscrolly.js"
import CandidateScrolly from "./js/components/candidatescrolly.js"
import CorruptScrolly from "./js/components/corruptscrolly.js"
import SectionHeader from './js/components/sectionheader.js'
import CandidateBar from './js/components/candidatebar.js'
import CorruptNetwork from './js/components/corruptnetwork.js';


/*Promise.all(["./data/donors_summarized_2015_20.csv","./data/top_donor_filings.csv"]).then(function(files) {
    d3.csv(files[0], d3.autoType).then(donors => {
        store.dispatch('addDonors', donors)
        init()
    })
})*/

function init() {

    let numberHeader = new NumberHeader()
    numberHeader.render()

    store.dispatch('addDonors', donors)
    store.dispatch('addTopDonors', topDonors);
    store.dispatch('addElecteds', electeds)
    store.dispatch('addDonorNames', donorNames)
    store.dispatch('addCuomoDonors', cuomoDonors)
    store.dispatch('addQuartiles', quartiles)

    let corruptScrolly = new CorruptScrolly()
    corruptScrolly.render()
    
    let biggestdonors = new SectionHeader("biggestdonors")
    biggestdonors.render("Who Pays Thousands of $$$?", "The vast majority of the money comes from people with more than $500\
    to throw around. What about those top 1%-ers? Who are those 429 donors? Who do they represent? What do they want?")
    
    let donorScrolly=new DonorScrolly()
    donorScrolly.render()
    
    let beneficiaries = new SectionHeader("beneficiaries")
    beneficiaries.render("Who Benefits?", "$100 million is a lot of money. Where is it going? Who has \"earned\" it?")

    let candidateScrolly = new CandidateScrolly()
    candidateScrolly.render()

    let candidateBar = new CandidateBar()
    candidateBar.render()
    
    let doesitmatter = new SectionHeader("doesitmatter")
    doesitmatter.render("Does it Matter?", "All that money to those who make our laws. Does it matter? Does it impact who is \
    protected by laws, who benefits from them, and who doesn't?  Here is an example from the pandemic.\
    <br><br><a target='_blank' href='https://www.nytimes.com/2020/05/13/nyregion/nursing-homes-coronavirus-new-york.html'><img src='./data/img/nyt_article.png'/></a><br> Cuomo's office snuck in a last minute addition to the budget in April, a\
     limitation on the liability for health care facilities,\
     including nursing homes. Members of the Senate and Assembly are working to pass bills to\
      overturn this. At the time of the budget negotiations, he had already issued an executive order that exempted workers from\
       malpractice suits. This language, buried on page 347 of the budget bill, is just about protecting\
      the ownership of these facilities. Right now you cannot sue the owners and operators of these facilities for negligence due to\
      the ways in which they ran the facilities before or during the pandemic. <br><br> In the last five years, Cuomo has gotten over\
      $894,400 directly from the healthcare organizations this provision protects and medical liability insurance companies that would \
      have had to pay for settlements. Those donations are shown below.\
        Note that this does not include any payments\
      given by individuals who may own or occupy leadership positions in these organizations.")
    
    let corruptNetwork = new CorruptNetwork()
    corruptNetwork.render()

    let closing = new SectionHeader("closing")
    closing.render("All this is legal. Is it corrupt?", "It is well documented that the wealthy have a strangle-hold on what\
    legislation is considered and passes.  None of this is \"new news.\" To explore further exactly who has paid money to the \
    current politicians you can check out the <a href='https://bit.ly/WhoPaysNY' target='_blank'>Who Pays NY? Interactive Tool</a> that allows you \
    to compare the donors between politicians.\
    <div class='header-2'>Does it have to be this way?</div>\
    The Bernie campaign in 2016 was a testing ground for a new kind of politics,\
    one in which corporate donations were not accepted, and the average contribution to the campaign was $27. While some money is crucial\
    to get a campaign going, the act of reaching voters can be done by volunteers, other voters, not by expensive T.V. ads or mailed flyers.\
    In 2018, Alexandria Ocasio-Cortez ran with this model and upset the Deputy Speaker of the House of Representatives.\
    Julia Salazar ran on this model, plus an expanded refusal to accept donations from real-estate and beat an incumbant to become state Senator. \
    In 2019, Tiffany Cabán ran for District Attorney\
    in Queens with this model and came within 55 votes of winning a campaign in which her opponent \
    <a href='https://thecity.nyc/2019/07/caban-beats-katz-in-latest-fundraising-and-legal-spending.html' target='_blank'>outspent her five\
     to one</a>.<br><br>The swearing off of real-estate money\
      <a href='https://nypost.com/2020/01/09/stringer-shuns-real-estate-money-for-mayor-bid-after-already-collecting-1m/' target='_blank'>has become vogue</a>\
     for politicians who are running for Mayor of New York City in 2021.<br><br>\
     There are now at least <a href='https://www.jacobinmag.com/2020/05/meet-new-yorks-socialist-insurgents' target='_blank'>\
     six candidates</a> who are running to represent New York in 2020, vowing off of corporate donations and \
     real-estate money. In addition to Salazar, they include Samelys Lopez for the House of Representatives District 15 seat in the Bronx, \
     Zohran Mamdani running for assembly in Queens, Phara Souffrant Forrest and Marcela Mitanyes running for assembly in Brooklyn, and\
     Jabari Brisport running for state senate in Brooklyn. \
     ")
}
init()


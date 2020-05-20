

// Data
import cuomoDonors from './data/cuomo_healthcare_donors.json'
import topDonors from "./data/top_donor_filings.csv"
import electeds from  "./data/Electeds_List.csv"
import donorNames from "./data/donor_list.csv"
import quartiles from "./data/donor_quartiles.csv"
import donors from './data/donors_summarized_2015_20.csv'

// Components
import store from './js/store/index.js'; 
import NumberHeader from "./js/components/numberheader1.js"
import DonorScrolly from "./js/components/donorscrolly.js"
import CandidateScrolly from "./js/components/candidatescrolly.js"
import CorruptScrolly from "./js/components/corruptscrolly.js"
import SectionHeader from './js/components/sectionheader.js'
import CandidateBar from './js/components/candidatebar.js'
import CorruptNetwork from './js/components/corruptnetwork.js';


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
    biggestdonors.render("Who Pays Thousands of $$$?", "The majority of political donations comes from people with more than $500\
    to throw around. Who are those 429 donors? Who do they represent? What do they want?")
    
    let donorScrolly=new DonorScrolly()
    donorScrolly.render()
    
    let beneficiaries = new SectionHeader("beneficiaries")
    beneficiaries.render("Who Benefits?", "$104 million is a lot of money. Where is it going? Who has \"earned\" it?")

    let candidateScrolly = new CandidateScrolly()
    candidateScrolly.render()

    let candidateBar = new CandidateBar()
    candidateBar.render()
    
    let doesitmatter = new SectionHeader("doesitmatter")
    doesitmatter.render("Does it Matter?", "All that money to the politicians who make our laws. Does it matter? Does it impact who is \
    protected by laws, who benefits from them, and who doesn't?  Here is an example from the pandemic.\
    <br><br><a target='_blank' href='https://www.nytimes.com/2020/05/13/nyregion/nursing-homes-coronavirus-new-york.html'><img src='./data/img/nyt_article.png'/></a><br>\
    Cuomo's office snuck in a last minute addition to the budget in April 2020: a limitation on the liability for healthcare facilities, \
    including nursing homes and providers of home healthcare. Members of the State Senate and Assembly are working to pass bills to \
    overturn this. At the time of the budget negotiations, Cuomo had already issued an executive order exempting workers from \
    malpractice suits during the public health emergency. But this new exemption, buried on page 347 of the \
    <a href='http://public.leginfo.state.ny.us/navigate.cgi?NVDTO:+&QUERYDATA=S7506B+&QUERYTYPE=BILLNO' target='_blank'>\
    budget bill</a>, also protects \
    the ownership of these corporations from being sued because of shortages in resources or staffing.\
    Right now, you cannot sue the owners and operators of these facilities for how they run them during the pandemic.\
     <br><br> In the last five years, Cuomo has gotten over \
    $894,400 directly from the healthcare organizations this provision protects, and the medical liability insurance companies that would \
    pay for settlements. Those donations are shown below. \
    Note that this does not include any payments given by individuals who may own or occupy leadership positions in these corporations.")
    
    let corruptNetwork = new CorruptNetwork()
    corruptNetwork.render()

    let closing = new SectionHeader("closing")
    closing.render("All this is legal. Is it corrupt?", "The wealthy have a strangle-hold on what\
    legislation is considered and passed. None of this is \"new news.\" Policies like raising the minimum wage, taxing the rich, and universal healthcare have broad support\
    within the electorate, yet never even come up for a vote. \
    <a href='https://scholar.princeton.edu/sites/default/files/mgilens/files/gilens_and_page_2014_-testing_theories_of_american_politics.doc.pdf' target='_blank'>\
    A 2014 study</a> measured who influenced federal policy from 1989-2002. The different groups measured were average citizens, \
    economic elites, mass-based interest groups (including everything from unions to the National Rifle Association) and business\
    interest groups. It found that average citizens have \"essentially zero\" \
    impact on policy changes at the national level.  Economic elites had by far the most influence, followed by business interest groups, which had 55% of the \
    of influence of economic elites. Mass-based groups had about half of the influence of business groups and about 30% of the influence of economic elites.\
    <br><br>The interests of all citizens are not equally represented by our government. Wealthy people matter far more than the vast majority of us.\
    Because of this, the suffering of poorer and working class members of society is allowed to continue and grow.\
    Our campaign finance system contributes to this inequality of representation.  Many other countries have \
    <a href='https://www.theatlantic.com/international/archive/2013/09/why-germany-s-politics-are-much-saner-cheaper-and-nicer-than-ours/280081/' target='_blank'>\
     different campaign finance systems</a> that cost their societies less\
    and allow for a broader plurality of interests to be represented in policy.\
    To explore further exactly who has paid money to the New York state politicians you can check out the\
     <a href='https://bit.ly/WhoPaysNY' target='_blank'>Who Pays NY? Interactive Tool</a> that allows you \
    to compare who donates to which politicians.<br><br>\
    <div class='header-2'>Can their be uncorrupted politicians in our corrupt system?</div>\
    Bernie Sanders' campaign in 2016 was a testing ground for a new kind of politics, \
    one in which corporate donations were not accepted and the average contribution to the campaign was $27. \
    While some money is crucial to get a campaign going, the act of reaching voters can be done by volunteers or \
    other voters, not by expensive television ads or mailed flyers.\
    In 2018, Alexandria Ocasio-Cortez ran for Congress with this model and upset the deputy speaker of the House of Representatives.\
    Julia Salazar ran for State Senate on this model, plus an expanded refusal to accept donations from real estate \
    and beat the incumbant to represent District 18. In 2019, Tiffany Cabán ran for district attorney\
    in Queens with this model, and came within 55 votes of winning a campaign in which her opponent \
    <a href='https://thecity.nyc/2019/07/caban-beats-katz-in-latest-fundraising-and-legal-spending.html' target='_blank'>outspent her five\
     to one</a>. The swearing off of real estate money has even\
      <a href='https://nypost.com/2020/01/09/stringer-shuns-real-estate-money-for-mayor-bid-after-already-collecting-1m/' target='_blank'>become a fad</a>\
     for candidates running for mayor of New York City in 2021.<br><br>\
     The influence and organization of the wealthy requires that those of us who are not in the 1% organize together to fight for our interests.\
     The New York City chapter of the Democratic Socialists of America, an organization that organizes working people to fight for policies that benefit\
     regular people over the wealthy, has endorsed <a href='https://www.jacobinmag.com/2020/05/meet-new-yorks-socialist-insurgents' target='_blank'>\
     six candidates</a>, members of the organization who running to represent New York in 2020. They are all refusing corporate donations and \
     real estate money. In addition to Salazar, they include Samelys Lopez running to represent New York's 15th congressional district in the Bronx, \
     Zohran Mamdani running for the Assembly representing Queens, Phara Souffrant Forrest and Marcela Mitanyes running for Assembly representing Brooklyn, and\
     Jabari Brisport running for State Senate representing Brooklyn. The pandemic seriously impacts the influence that volunteers can have in reaching their\
     fellow voters\
     so we will have to see what happens in the state primaries at the end of June.")
}
init()


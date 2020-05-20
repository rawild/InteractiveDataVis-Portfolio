import Component from '../lib/component.js';
import store from '../store/index.js';
import * as d3 from 'd3';
import scrollama from 'scrollama';
import 'intersection-observer';
import SidePanel from './sidepanel.js';

export default class CandidateScrolly extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#candidate-scrolly'),
        });
        this.local = { 
        }
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {

        let self = this;
        var donorScrolly = self.element
        var figure = donorScrolly.select("figure");
        var donorArticle = donorScrolly.select("article");
        var step = donorArticle.selectAll(".step");

        let scroller = scrollama();
        // setup the instance, pass callback functions
        setupStickyfill();

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
        .setup({
            step: "#candidate-scrolly article .step",
            offset: 0.33,
            debug: false
        })
        .onStepEnter(handleStepEnter);

        // setup resize event
         window.addEventListener("resize", handleResize);
        
        /** setup the sidebar  */
        let candidateSide1 = new SidePanel('C1')
        candidateSide1.render("$$ Proportional to Power", "These are the nine politicians who received more than $1,500,000.  \
        How much money you got seems proportional to the amount\
         of power you have in Albany. Andrew Cuomo, the governor, has a massive amount of power, and received\
         45% of the total money in the last five years. You can investigate the donors who paid Cuomo compared to other politicians\
         <a target='_blank' href='https://bit.ly/WhoPaysNY'> with this tool</a>.","candidate-side")

        let candidateSide2 = new SidePanel('C2')
        candidateSide2.render("The Governor: 45% of the money, 45% of the power", "The governor has immense control over the\
        budgeting process, which has become an 'omnibus' process where the governor stuffs his legislative priorities.\
        The budget has to pass, and thus, it is a way to force legislation through.\
        Additionally, from 2012 to 2018, the State Senate was held by Republicans and\
        the Assembly by the Democrats. This gave the governor more power as the 'dealmaker.'","candidate-side","candidate-body")

        let candidateSide3 = new SidePanel('C3')
        candidateSide3.render("The State Attorney General:", "As a statewide office, this position\
         has a lot of power to determine which \
        illegal actors to pursue, whether negligent landlords or healthcare providers who are scamming Medicaid.\
        It also generally costs a lot of money to win a statewide office, especially if it is a contested race and you are not the incumbent.\
        Leticia James was first elected in 2018 in\
         a hotly contested race with Zephyr Teachout. She received $4 million in donations in that race.","candidate-side","candidate-body")

        let candidateSide4 = new SidePanel('C4')
        candidateSide4.render("The State Comptroller:", "As a statewide office, this position\
         has a lot of power to review the finances of the state and to make recommendations to the legislature and governor.\
         Despite reporting budget deficits for years, DiNapoli has only ever recommended cuts to services. This includes cuts to Medicaid during\
         the COVID-19 pandemic. The comptroller could recommend raising taxes on the wealthy or corporations, but has not ever done so.\
         If he did and they were implemented, many of these donors would have to pay more in taxes.","candidate-side","candidate-body")
        
        let candidateSide5 = new SidePanel('C5')
        candidateSide5.render("The Speaker of the Assembly:", "This position has control over commmittee appointments, Community Fund\
         spending, and the agenda for the Assembly. The speaker decides what bills will be voted on when. The Assembly is\
          majority Democrat, and theoretically, members could bring votes from the floor. But members who challenge the speaker endanger \
          their committee appointments and community funding in their district. The speaker is also \
          the sole representative of the Assembly during final budget negotiations with the governor and the majority leader\
          of the Senate.","candidate-side","candidate-body")

        let candidateSide6 = new SidePanel('C6')
        candidateSide6.render("The Lieutenant Governor:", "This is a statewide position that can set the agenda for the State Senate, \
        make committee appointments in that body, and vote in case of a tie.\
        Between 2012 to 2018, a group of Democrats joined with the Republicans, giving them a narrow majority. At that time, the lieutenant governor was\
        influential in managing the agenda of the body. Kathy Hochul also ran a very close race for re-election in 2018 against\
        Jumaane Williams. $2,296,000 of her donations came from that race.","candidate-side","candidate-body")
        
        let candidateSide7 = new SidePanel('C7')
        candidateSide7.render("The Majority Leader of the Senate:", "In the absence of the lieutenant governor, the majority leader of the State Senate\
        sets the agenda of the senate and makes committee appointments. Similar to\
        the speaker of the Assembly, the majority leader has traditionally been the sole representative of the senate during the final\
        budget negotiations with the governor. After getting elected speaker in 2018, Stewart-Cousins'\
        yearly reciepts doubled.","candidate-side","candidate-body")

        let candidateSide8 = new SidePanel('C8')
        candidateSide8.render("The Deputy Majority Leader of the Senate:", "The deputy majority leader of the State Senate presumably has\
        influence within the Democratic conference and in senate procedure. Michael Gianaris also seriously contemplated a run for\
        state attorney general in the 2018 election, but pulled out after Leticia James entered the race. That prepartion most certainly\
        included a lot of fundraising. Gianaris is also chair of the Democratic Senate Campaign Committee that provides funds to\
        re-elect members of the Democratic senate conference.","candidate-side","candidate-body")
        
        let candidateSide9 = new SidePanel('C9')
        candidateSide9.render("Running for Higher Office:", "Michael Blake is an assemblyperson first elected to represent the Bronx in 2014.\
        He previously held cabinet positions in the Obama administration, and was then appointed vice-chair of the Democratic National Committee in 2017. He \
        ran for public advocate in 2018, recieving $838,016 in matching funds from the city in that race. He is currently running for Congress\
        in New York's 15th district.","candidate-side","candidate-body")

        let candidateSide10 = new SidePanel('C10')
        candidateSide10.render("Vestiges of the Break-Off Democrats:", "Diane Savino, a state senator whose district covers both Staten Island and Brooklyn,\
         is <a target='_blank' href='https://www.vox.com/policy-and-politics/2018/9/14/17859200/idc-new-york-primaries-democrats-biaggi-klein'>one of two\
        break-off Democrats to survive challengers in the 2018 elections </a>. The break-off Democrats, called the Independent Democratic Conference (IDC),\
        defected from the Democratic conference from 2012 to 2018 to give the Republicans control of the State Senate. As a result, these individuals had a lot of \
        influence in the budget, the overall agenda of the senate, and getting money spent in their districts.","candidate-side",
        "candidate-body")

        /** helper functions */
        
        function handleResize() {
            // 1. update height of step elements
            var stepH = Math.floor(window.innerHeight * 0.75);
            step.style("height", stepH + "px");
        
            var figureHeight = window.innerHeight / 2;
            var figureMarginTop = (window.innerHeight - figureHeight) / 2;
        
            figure
                .style("height", figureHeight + "px")
                .style("top", figureMarginTop + "px");
        
            // 3. tell scrollama to update new element dimensions
            scroller.resize();
        }
        let pols = [93,95,96,88,94,26,3,84,14]
        function handleStepEnter(response) {
            // response = { element, direction, index }
    
            // add color to current step only
            step.classed("is-active", function(d, i) {
                return i === response.index;
            });
            if (response.index == 0) {
                d3.select(".barPolHighlight")
                    .classed("barPolHighlight", false)
            }
            // update graphic based on step
            if (response.index  > 0){
                d3.select(".barPolHighlight")
                    .classed("barPolHighlight", false)
                d3.select('#candidate'+pols[response.index-1])
                    .classed("barPolHighlight", true)
            }
        }
        
        function setupStickyfill() {
            d3.selectAll(".sticky").each(function() {
                Stickyfill.add(this);
            });
        }
    }

    
    
    
    
    
}
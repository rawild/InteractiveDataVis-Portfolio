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
         of power you have in Albany. Andrew Cuomo, the Governor, has a massive amount of power in Albany, and recieved\
         45% of the total money in the last 5 years. You can investigate the donors who paid Cuomo compared to the other politicians\
         <a target='_blank' href='https://bit.ly/WhoPaysNY'> with this tool</a>.","candidate-side")

        let candidateSide2 = new SidePanel('C2')
        candidateSide2.render("The Governor: 45% of the money, 45% of the power", "The Governor has immense control over the\
        budgeting process, which has become an 'Omnibus' process where any kind of bill can get forced into the budget if\
        they are part of the Governor's legislative priority. The budget has to pass, and thus it is a way to force legislation through.\
        Additionally, before from 2015-2018, the Senate was held by Republicans and\
        the Assembly by the Democrats. This gave more power to the Governor as the 'deal-maker.'","candidate-side","candidate-body")

        let candidateSide3 = new SidePanel('C3')
        candidateSide3.render("The State Attorney General:", "As a state-wide office, this position\
         has a lot of power of determining which \
        illegal actors to pursue statewide, whether negligent landlords, or healthcare providers who are scamming Medicaid.\
        It also generally costs a lot of money to win a statewide office, especially if it is a contested race and you are not incumbent.\
        Leticia James was first elected in 2018 in\
         a race hotly contested by Zephyr Teachout.  $4 million donations came in 2018 around that race.","candidate-side","candidate-body")

        let candidateSide4 = new SidePanel('C4')
        candidateSide4.render("The State Comptroller:", "As a state-wide office, this position\
         has a lot of power in review the finances of the state and making recommendations to the Legislature and Governor about finances.\
        The comptroller has, despite reporting budget deficits, only recommended cuts to services, including to Medicaid during\
        the COVID-19 pandemic.  The comptroller could recommend raising taxes on the wealthy or corporations, but has not ever done so.\
        Many of these donors would have to pay more in these kinds of taxes, were they to be implemented.","candidate-side","candidate-body")
        
        let candidateSide5 = new SidePanel('C5')
        candidateSide5.render("The Speaker of the Assembly:", "This position has control over commmittee appointments, Community Fund\
         spending, and the agenda for the Assembly. The Speaker decides what bills will be voted on where. While the Assembly has\
          a large majority Democrat and theoretically could, bring votes from the floor, members that contradict the speaker put\
          community funding in their district and their committee appointments in jeopardy. The Speaker is also \
          the sole representative of the Assembly during the final budget negotiations with the Governor and the Majority Leader\
          of the Senate.","candidate-side","candidate-body")

        let candidateSide6 = new SidePanel('C6')
        candidateSide6.render("The Lieutenant Governor:", "This is a statewide position that can set the agenda for the state Senate, \
        make committee appointments in that body, and vote in case of a tie. As President of the Senate, The Lt. Governor has a deciding vote if the body is split.\
        for 2015-2018, when a group of Democrats caucused with the Republicans to give them a narrow majority, the Lt. Governor was\
        influential in managing the agenda of the body. Kathy Hochul also ran a very close race for re-election in 2018 against\
        Jumaane Williams. $3 million of her donations came in 2018 around that race.","candidate-side","candidate-body")
        
        let candidateSide7 = new SidePanel('C7')
        candidateSide7.render("The Majority Leader of the Senate:", "The majority leader of the Senate, in the absence of the Lt. Governor\
        has all the powers of the Lt. Governor, including setting the agenda of the Senate, and making committee appointments. Similar to\
        the Speaker of the Assembly the Majority Leader has traditionally been the sole representative of the Senate during the final\
        budget negotiations with the Governor and the Speaker of the Assembly. After getting elected Speaker in 2018, Stewart-Cousins'\
        yearly reciepts doubled.","candidate-side","candidate-body")

        let candidateSide8 = new SidePanel('C8')
        candidateSide8.render("The Deputy Majority Leader of the Senate:", "The deputy majority leader of the Senate, presumably has\
        influence within the caucus and in the run of procedure in the Senate. Michael Gianaris also seriously prepared to run for\
        state Attorney General in the 2018 election. That prepartion most certainly included a lot of fundraising.  Gianaris is\
        also Chair of the Democratic Senate Campaign Committee that provides funds to re-elect members of the Democratic senate\
        conference.","candidate-side","candidate-body")
        
        let candidateSide9 = new SidePanel('C9')
        candidateSide9.render("Running for Higher Office:", "Michael Blake is an Assemblyperson who was elected to represent the Bronx in 2014.\
        He held cabinet positions in the Obama administration, and was appointed vice-chair of the Democratic National Committee in 2017. He \
        ran for Public Advocate in 2018, recieving $838,016 in matching funds from the city in that race. He is currently running for Congress\
        in the NY 15th district.","candidate-side","candidate-body")

        let candidateSide10 = new SidePanel('C10')
        candidateSide10.render("Vestiges of the IDC Break-off Democrats:", "Diane Savino, a state Senator whose district covers both Staten Island and Brooklyn,\
         is <a target='_blank' href='https://www.vox.com/policy-and-politics/2018/9/14/17859200/idc-new-york-primaries-democrats-biaggi-klein'>one of two of the\
          break-off Democrats to survive challengers in the 2018 elections </a>. The break-off Democrats defected from the\
          Democratic party from 2012-2018 to give the Republicans control of the Senate. As a result, these individuals had a lot of \
        influence both on getting more money spent in their districts, and the budget and overall agenda of the Senate.","candidate-side",
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
import Component from '../lib/component.js';
import store from '../store/index.js';
import DonorBar from './donorbar.js';
import DonorBubble from './donorbubble.js';
import SidePanel from './sidepanel.js';

import * as d3 from 'd3';
import scrollama from 'scrollama';
import 'intersection-observer';



export default class DonorScrolly extends Component {
    constructor() {
        super({
            store,
            element: d3.select('#donor-scrolly'),
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
        console.log("donor-scrolly rendering")
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
                step: "#donor-scrolly article .step",
                offset: 0.25,
                debug: false
            })
        .onStepEnter(handleStepEnter);

            // setup resize event
            window.addEventListener("resize", handleResize);

        
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

            
            function handleStepEnter(response) {
                //console.log(response);
                // response = { element, direction, index }
        
                // add color to current step only
                step.classed("is-active", function(d, i) {
                    return i === response.index;
                });
                // update graphic based on step
                if (response.index == 0) {
                    let donorBar = new DonorBar();
                    donorBar.render()
                } else if (response.index == 1){
                    let donorBubble1 = new DonorBubble(948); // donor bubble for NYC Campaign Finance Board
                    donorBubble1.render()
                } else if (response.index == 2){
                    let donorBubble2 = new DonorBubble(188); // donor bubble for NYC Campaign Finance Board
                    donorBubble2.render()
                } else if (response.index == 3){
                    let donorBubble1 = new DonorBubble(196); // donor bubble for NYC Campaign Finance Board
                    donorBubble1.render()
                }
            }
            
            function setupStickyfill() {
                d3.selectAll(".sticky").each(function() {
                  Stickyfill.add(this);
                });
              }


            let scroller2 = scrollama()
            scroller2
                .setup({
                    step: "#donor-scrolly article .baby-step",
                    debug: false,
                    offset: 0.33
                })
            .onStepEnter(handleBabyStepEnter)
            .onStepExit(handleBabyStepExit)
            
            // set Candidate Color
            store.dispatch('setCandidateColors', 
                d3.scaleSequential(d3.interpolateYlOrRd).domain([-10, 96]))

            /** Render Side Panels */
           
            let donorSide1 = new SidePanel('B1')
            donorSide1.render('The Biggest Donors', " Who are those big donors? 429 donors is a lot to go through. \
            Let's look at the eleven donors who gave more than $500,000 between \
            2015 and 2020. Some of them are surprising.","donor-side")

            let donorSide2 = new SidePanel('B2')
            donorSide2.render('The N.Y.C. Campaign Finance Board: $2,232,391' , "New York City provides public financing to candidates.\
            The N.Y.C. Campaign Finance Board is the government agency that pays matching funds to qualifying candidates who run in city \
            elections. Why does money from city elections\
            show up in donations to state politicians? Between 2015 and 2020, all of these politicians ran for public advocate. Any matching\
            funds they had left over are transferrable to other races.","donor-side")

            let donorSide3 = new SidePanel('B3')
            donorSide3.render('The LAWPAC of NY: $1,275,160' , "What is the LAWPAC, and why do trial\
            lawyers spend so much money on candidates? The LAWPAC represents trial lawyers who earn their\
            living by helping people to sue for liability. In the last five years, there were many contested\
            laws about who is liable for what. See Carlos' Law as an example. There are also bills before the\
            state legislature to limit the percentage that trial lawyers can get paid from a settlement.\
            <br><br>The LAWPAC casts a broad net donating 439 times total, including at least one donation to 79 of\
            the 86 candidates. The average amount that they paid to a politician in the last 5 years was $2,905. \
            The maximum that they paid to a single politician was $69,700. Note that while these donations represent\
            this organization, trial lawyer association members can also donate as individuals and via other PACs.\
            ","donor-side")

            let donorSide4 = new SidePanel('B4')
            donorSide4.render('1199 SEIU United Healthcare Workers: $989,150', "1199 SEIU is a local of the Service\
            Employees International Union for New York state and many other east coast states. Their union members\
            include home health aides, janitors, pharmacists, techs, lab workers, nurse aides, house cleaners, social workers,\
            and many other healthcare workers. They are the major union behind the Fight for $15 nationwide, and in 2016,\
            won a gradual increase in the minimum wage in New York. They also were a big part of the Green Light NY Coalition that won access to driver's \
            licenses for undocumented people in New York in 2019.<br><br> Similar to the LAWPAC, 1199 SEIU casts a wide net, and\
            donated to 82 of the 86 candidates. The average amount that they paid to a politician in the last 5 years was $4,300,\
            and they seem to spread their money around a little more than the LAWPAC, however. Still their donations are skewed\
            towards the top. The maximum amount they paid to a politician was $50,000. Unlike trial lawyers, most of the members\
            of 1199 SIEU are low paid. It seems unlikely that a significant\
            portion of them have the disposable income to throw around to donate as individuals.","donor-side")

            /**  helper functions */
            function handleBabyStepEnter(response) {
                //console.log(response)
                if (response.index == 0) {
                    d3.select('#donor948')
                        .classed("barHighlighted", true)
                    let side = d3.select("[baby-data = \"1\"]")
                    side.append("div")
                        .classed("header-2",true)
                        .text("#1 The N.Y.C. Campaign Finance Board (????)")
                    side.append("div")
                        .text("Yep, that's right. The single biggest donor in the last five years was the New York City \
                        Campaign Finance Board. This is due to the public financing of citywide elections. \
                        Confused? Will explain below.")
                } else if (response.index == 1) {
                    d3.select('#donor188')
                        .classed("barHighlighted", true)
                    let side = d3.select("[baby-data = \"2\"]")
                    side.append("div")
                        .classed("header-2",true)
                        .text("#2 The LAWPAC?")
                    side.append("div")
                        .text("This is one of two trial lawyers associations in New York. Trial lawyers help\
                        people sue after an accident, for example. They care about liability, and the exact laws on the books.\
                        More info below.")
                } else if (response.index == 2) {
                    d3.select('#donor196')
                        .classed("barHighlighted", true)
                    let side = d3.select("[baby-data = \"3\"]")
                    side.append("div")
                        .classed("header-2",true)
                        .text("#3 1199 SEIU?")
                    side.append("div")
                        .text("1199 SEIU is a local of the Service Employees International Union that represents healthcare workers\
                        in New York and other states. More info below.")
                }


            }
            function handleBabyStepExit(response) {
                //console.log(response)
                if (response.index == 0) {
                    d3.select('#donor948')
                        .classed("barHighlighted", false)
                    d3.select("[baby-data = \"1\"]").selectAll("*").remove()
                } else if( response.index == 1){
                    d3.select('#donor188')
                        .classed("barHighlighted", false)
                    d3.select("[baby-data = \"2\"]").selectAll("*").remove()
                }  else if( response.index == 2){
                    d3.select('#donor196')
                        .classed("barHighlighted", false)
                    d3.select("[baby-data = \"3\"]").selectAll("*").remove()
                }

            }

        }

    
    
    
    
    
}
# Prospectus
## Inspiration
The inspiration for this project comes from my Project 1. It became clear working with the campaign finance data for project 1 that there are some major repeat donors who donate across politicians, but because of the way the data is recorded, it is difficult to track that.  As part of project 1, I used some machine learning libraries to deduplicate these donors and group them together, on the organizational level. However, there are larger categories within which these individual organizations fall (e.g. lawyers, health care providers, real estate, food industry, gambling industry, fossil fuel industry, building trades unions etc.). Specifically for this project I am interested in groups associated with Real-estate and development. 

## Questions
My initial question is who disproportionately gets donations from real-estate interests? Is there a clear change in the way realestate interests are donating in the wake of their loss in Albany last year? Who is benefiting?

## Users
My intended users are local-politics nerds like myself who know who many of the elected officials are, and would like to dig more deeply into who supports them. They won't need to know anything about the campaign finance cycles or filings.

## Data
The data comes from the statewide board of elections for city and state-level officials. I am limiting it just to elected state-wide officials whose districts cover at least part of the 5 boroughs (not other parts of the state). I have, like I said, done clustering of existing donors based on address and name, to identfy organizations that are the same organization accross different candidates and filings. Now I plan to do some futher analysis to assign a 'real-estate' type to the donors and will pick a few interesting politicians or years from that. I know this project isn't supposed to be a data analysis project, but that's what I'm here to get my degree in, so I'm doing it. I have a reporter friend that analyzed SD-18 realestate donations in the 2018 election cycle (a project I helped with but only a little). I am hoping to use her list as a starter.


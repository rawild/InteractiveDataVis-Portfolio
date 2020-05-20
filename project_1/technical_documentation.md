# Technical Documentation for Who Pays NY

## Summary
The donation data comes from the New York State Board of Elections reports:
<a href="https://www.elections.ny.gov/CFViewReports.html" target="_blank">https://www.elections.ny.gov/CFViewReports.html</a>. 
The donations include those filed for the current politicians and their committees from January 2015 through the January 2020 
filing date. The candidates included are those politicians that currently represent the five boroughs in the State Senate and Assembly, 
plus the majority leader of the senate, Andrea Stewart Cousins, and the four statewide positions:
governor, lieutenant governor, comptroller, and attorney general. The filing committees were compiled by searching for the policitians' 
names in the name of all of the filing committees that had ever filed.. This is an imperfect search that is ongoing. There were some candidates that weren't included because they had no filing committees that had recent filings clearly associated with their names. A review to include them is ongoing. 
<br><br>
Because of the lack of clarity about
committees that are associated with the politicians, as well as the conservative nuture of the clustering of donors together, these numbers can be considered
a "minimum."
<br><br>
The donors were clustered across different candidates' filings with the dedupe python library: <a href="https://github.com/dedupeio/dedupe">https://github.com/dedupeio/dedupe</a>. Additional
human review is ongoing.  There are still different clusters within the dataset that should be considered the same "donor," 
The intention is to continue to improve the mapping and naming of the linked donors.  
If you would like to explore the underlying data in more detail
you can go to the <a href="https://bit.ly/WhoPaysNY">WhoPaysNY Interactive Tool</a>. 

## The Politicians
The initial politician list included 96 politicians. This included the 91 2020 state senators and assemblypeople whose districts included any of the five bouroughs of New York City, plus the plus the majority leader of the senate, Andrea Stewart Cousins, and the four statewide positions: governor, lieutenant governor, comptroller, and attorney general. Compiling these lists came from wikipedia, ballotopedia and the websites for the New York State Senate and the Assembly.

## The Committee "Filers"
The list of all "Filer" committees that have ever filed with the NY State board of elections is available on <a href="https://www.elections.ny.gov/CFViewReports.html" target="_blank">their website as the "Filer data file"</a>. I wrote a python script to find the filers that had either the first or last name of any of the politicians in the list above. After getting a list of all the possible filers, I manually compared the list of identified filers with results returned by the Board of Elections *Search our Database by
Candidate Name or Committe Name* page to ensure that for common names the filers were correct. At the end of this step, I had a list of 476 filers associated with the 96 politicians. These committees have names like "Andrew Lanza for Staten Island," "Friends of Andrew J. Lanza", or just "Andrew J. Lanza."

## The Filings for The Committees
The data file for all of the filings ever made is available on the Board of Elections website called "Data file containing ALL filings." This is an "ascii delimited" file, but there are also code book files you can use to parse the data and find the column widths. Once that is done, the data contains a row for each donation ever filed with the board of elections. It is surprisingly lightweight, less than 1 GB. I wrote a python script to search this file for all the filings associated with the IDs of the "Filers" identified in the step above. At this point there were 10 politicians that had no filings associated with their "filers". For the sake of moving forward, I dropped those politicians from the group.

## Getting the Right "Filings"
Each filing row represents a donation. It has "FILER_ID" which I have associated with a specific politician. It also has "TRANSACTION_CODE". I was only interested in receipts, not payments, so I removed any filings that weren't types A,B,C,D, or E. I also initially decided to look back 10 years since most of the politicians had not been in office that long. I dropped any filings from years after that.

## Cleaning the Filings for Grouping
Filings have multiple "name" values depending on the type of donor. I consolidated that into a single column. They also have two columns representing "donor type": TRANSACTION_CODE and CONTRIB_CODE_20. I consolidated those into a single column also. I tried to use grouping functions in python (similar to the "group by" in SQL) to reduce the filings, but given the variance in spelling of the names of the donors between different "filings" it did not work very well. At this point I had a little over 300,000 filings.

## Grouping the Filings with the dedupe python library
First, I decided only to attempt to use dedupe to group the filings that were not "IND" (individual) types. This was because it is very hard to know if a person who has the same name as someone else, but a different address, is the same person. This reduced my list of filings to cluster to a little less than 82,000. I used the dedupe <a href="https://github.com/dedupeio/dedupe-examples" target="_blank">template for a simple csv project</a> to setup a project to dedupe the donors, using the donor "name" field, as well as the various address fields "street", "city","state", and "zip".  

To speed up the built in "learning" process that the library usually uses via a command line interface, I went through a list of the donors (sorted by donor name) and identified sets of donors from different letters and of different types that were the same donor. I then sorted the donor list by address info and did a similar match for donors that have many different abbreviations that are associated with them. I used python to convert the matched donor csv into the json file that the dedupe library uses as its "training file."  What I failed to do was to identify donors that were not the same, so I had to go through the command line interface to identify about 1000 donors that were not the same as part of the algorithm training.

The clusters from the donors were very good, but certainly not perfect.

## Manual Cluster Review
Because it is quarantine and I am a crazy person, I did a manual review of the clusters. There were just shy of 16,000 clusters that came out of the ~82,000 non-individual filings. Certainly a single pass review of the clusters is not rigorous enough for publishable data, but I was able to fix the major major issues. I sorted the lists by donor name and address and so was able to identify groups that were split and should have been together and groups that were together and should have been apart.

## Connect the Clusters back to the rest of the list
I also "grouped" the donor data by assigning a Cluster ID if the filings had the same name with the same spelling and the same address. I then put the clustered non-individual data with the clustered individual data back in the same list. I used python to group the data by cluster ID and candidate to get a list of all of the donors who had given to each candidate, along with summary statistics like number of donations, minimum and maximum contribution and average contribution. The list of donors by candidate was about 245,000 rows.  

## Reduce the list to only 5 years
As I was using hierarchical data structures in D3 to create the stacked barchart that is part of the interactive tool, I was running into performance issues in the browser. Cutting the list down to filings in the last 5 years reduced the list to ~73,000 donors by candidates, and was much more performative in the browser.

## Summary Statistics
The summary statistics that I use in the narrative project were calculated using python.






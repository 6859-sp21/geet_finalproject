# geet_finalproject

The evolution of the final project was based on the feedback received on my A4. I wanted my final project to be in sync with my main learning from the class. Given a set of data, how can we present it in a way that people engage with it more, understand it more and understand it more easily. 

My A4 had a basic scrolly-telling interface and two visualizations. Both the visualizations were similar. They were multi line charts, one representing GDP and the other representing GDP-per capita. I had received points for implementing the scrolly telling however the visualizations were rated slightly below average. 

From A4 to final project here are the changes and additions

##Changes
1.	I removed one line graph where I was just plotting GDP of different countries. 
2.	I almost completely changed the other line graph. This time, I used D3’s selection join functionality unlike the last time where I used to flush the svg element and replot everything. This has allowed for much smoother transitions and a much more seamless experience for the user. It has also allowed me more control over the transitions. When the user plots richest countries against India, the line of India drops down in the graph, producing the desired effect, i.e. a strong realization of how big the gap is between Indian people and some of the richest western countries. 


##Additions
1.	I restructured the entire layout of the webpage/visualization. The old format straightaway jumped into a scrollytelling whereas the new employes the use of “Flex” containers to start with a landing page, then goes into scrolly telling, and then finally ends with the option of adding a martini glass visualization. (This was not possible in A4 structure)

2.	Added a “parallax” feature in the first image which gives the user an impression of scrolling up above the front image

3.	Added a bar chart race as the first viz to depict the change in GDP of countries. This was much more engaging than a simple line plot
    a.	Added a slider in the bar chart race to allow the user to slowly-visualize the process at the location of their interest
    b.	Ensured that India and China stand out in the bars. I do so as these are the two countries I want to draw attention to. Both were in a similar economic   condition pre-80s and early 80s and then both made a huge progress. However I would also like the users to see how China is fast differentiating itself from India.
    c.	I changed the remove-line feature. In A4, the user had to click on the line to remove it from the viz, I changed it to remove line on clicking associated country name. This gives the user access to more clicking area and is much more convenient. 
    d.	The text labels at the end of each line also transition with the line when the user adds/removes a line. However, I have set the transition duration for the text labels to be lesser than that of actual line. This gives the impression that the country label is pulling the line up or down. 
    e.	Add multiple countries and compare the countries that you want
    f.	I had received feedback to make sure the color for the same country stays the same everywhere, however I did not feel that was important as a first priority. 


4.	Added a hans rosling styled scatter plot which allows the user to see the relative change between GDP and parameters like total patents filed by the country, over time. The user has also been provided a slider to interact with the visualization at their own pace. The user can finally also change the X-parameter, i.e. choose another parameter correlated with the GDP. In this visualization I have colored India and China as orange and all other countries are blue. The intention here was the same as in the first visualization (bar chart race). 

5.	Added a Navigation pane at the top of the page which stays there (It needs to be populated more than it is right now)

6.	I am telling a much longer and much more wholesome story this time. I start with an intro to the GDP growth, then highlight that despite growth, people are still poor. Then I tell the factors that most highly affect the GDP and finally I allow people to see how different states fare in their contributions to the GDP and how can their GDP be segmented into sectors of economy. This also allows the user to match the dominant sectors of the state’s economy with parameters which affect GDP in general. 

7.	Based on feedback on A4, I added another image (another prime minister of India) to highlight the important historical event in India (liberalization and opening up of the economy)



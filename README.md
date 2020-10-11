# D3-challenge
Week 16 homework in boot camp

This homework assignment takes data for state rates of poverty, median household income, % lacking healthcare, and % suffering from obesity.  Using D3 a scatter plot
is generated that allows the user to select the % in poverty or the house hold median income on the horizontal axis (x axis). Similarly, the user is provided the ability
to select either the % lacking healthcare or the % suffering obesity on the vertical axis (y-axis).  When data sets are selected the new data is rendered in the 
plot, utilizing the transition function (creating an animated transition).  Furthermore, each data point represents a state and is labeled in the point.  A feature is also
provided that allows the state data to be displayed by passing the mouse over the point.  A couple of notes are provided below:
1. The index.html is contained in the StarterCode directory.
2. The javascript code (app.js) is contained in the assets directory contained in StarterCode.
3. The mouseover function was employed instead of on-click.  This appeared to work better and was easier for the user to employ.
4. As an added feature the data point color changes when changing x axis data.  The background color of the data field also changes.
5. When hovering over a data point the color and opacity of the data point changes.  A two color scheme is used (yellow and light blue).  When changing x axis the data
point color changes.  The color when hover over is also changed to better highlight which point is selected.

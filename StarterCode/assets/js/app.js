//Homework 16 - D3 Plots
// Jeff Brown
//This home work focuses on using D3 to make a custom graph with selectable axis values 
//and transitional features when changing selections.
//It also makes use of tool tips to show values of data points.

//The code plots the % lacking healthcare on the Y axis and the % in poverty and the median income on the x axis.
//The user can select between %in poverty and median income on the x axis and the plot will update and use transitions.
//User can also move the mouse over a point and see the data (using tool tips)

//Setting display window
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 40,
  bottom: 150,
  left: 100
};

//setting height and width of plot region
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty"; //setting initial axis value to display on graph
var axisNum = 0;
cirColor = ["lightblue", "yellow"]
//**********************************************************************/
//****************Defining Functions ***********************************/

//**********************************************************************/
// function used for updating x-scale var upon click on axis label
function xScale(passData,chosenAxis) {
  //create scales
  var xLinearScale = d3.scaleLinear()
    // Axis is set to have minimum at 85% of data minimum and 115% of maximum so looks nicely placed on axis
      .domain([d3.min(passData, d => d[chosenAxis])*0.85, d3.max(passData, d => d[chosenAxis])*1.15])
      .range([0, width]);
    return xLinearScale
};

//**********************************************************************/
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

//**********************************************************************/
// function used for updating circles when switch axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, cirColor) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("fill", cirColor);
  return circlesGroup;
};

//**********************************************************************/
//function used for updating label of circles (state abbreviation)
//using render function clears previous marker location
function renderCircLabel(cirLabelGroup,newXScale, chosenAxis,r) {
  cirLabelGroup.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenAxis])-r/2)
  .attr("fill", "darkblue");
  return cirLabelGroup;
  };

///*******************Loading Data into d3******************/
var url = "./assets/data/data.csv"; //location of data

d3.csv(url).then(function(healthData) {
    
  //code below is used to check input data set on console - used for debugging
    console.log(Object.keys(healthData[0])); //for error checking and to verify keys
    for (i = 0; i<healthData.length; i++) {
        console.log(healthData[i].state + " abbr:  " + healthData[i].abbr);
     };
    console.log(healthData[1].healthcare)
    
    //making certain all data is in number not string.
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
      });

    //setting up initial plot
    //setting x axis values
    var xLinearScale = xScale(healthData, chosenXAxis);
    //setting y axis values
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    //assigning bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

   //assiging group for chart.  
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
  
  //Drawing data points
  var r = 10; //radius for circles
  //inserting circles into html using svg
  //chosenXAxis is the intial set parameter    
  var circlesGroup = chartGroup.selectAll(".circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", r)
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("fill", "lightblue")
    .attr("opacity", "0.75");
    
//Setting labels (state abbreviation) for points
var cirLabelGroup = chartGroup.selectAll(".text") 
  .data(healthData)
  .enter()
  .append("text") 
  .attr("x", d => xLinearScale(d[chosenXAxis])-r/2) //offsetting by radius to get correct placement of points
  .attr("y", d => yLinearScale(d.healthcare)+r/2)
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("fill", "black")
  .text( function(d) {
      return (d.abbr);
  });

// Create axes labels
chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left +20)
   .attr("x", 0 - (height / 2 + 50))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("% Lacking Healthcare");

var labelsXGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`);


//Placing poverty label
var povertyLabel = labelsXGroup.append("text")
  .attr("x",0)
  .attr("y",5)
  .attr("value", "poverty")//value for event listener
  .classed("active",true)
  .text("% in Poverty");
//Placing House Hold Median Income label
var incomeLabel = labelsXGroup.append("text")
  .attr("x",0)
  .attr("y",25)
  .attr("value", "income")//value for event listener
  .classed("active", false)
  .classed("inactive", true)
  .text("House Hold Median Income ($)");

//*******************Tool Tip Section*********************************/    
//  Initialize tool tip
// ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .style("background",cirColor[(1-axisNum)])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br> Median Income: ${d.income}<br> Lacking Healthcare: ${d.healthcare}`);
    });

//  Create tooltip in the chart
// ==============================
  chartGroup.call(toolTip);

//  Create event listeners to display and hide the tooltip.  Use mouse over because seems easier to use (finding point)
// ==============================
  circlesGroup.on("mouseover", function(data) {
    d3.select(this).attr("opacity", "1");//make fill solid
    d3.select(this).attr("fill", cirColor[(1-axisNum)]);//change color
    toolTip.show(data, this)
    .style("background",cirColor[(1-axisNum)]);//makes circle and tool tip data box have same color
  })
// onmouseout event - clearing on mouse out
    .on("mouseout", function(data, index) {
      d3.select(this).attr("opacity", "0.75");//back to original opacity
      d3.select(this).attr("fill", cirColor[axisNum]);//back to original color
      toolTip.hide(data);
    });


//Selecting X axis value with mouse
labelsXGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");//"this" refers to selected element
    if (value !== chosenXAxis) {

      chosenXAxis = value;
      xLinearScale = xScale(healthData, chosenXAxis);
      xAxis = renderAxes(xLinearScale,xAxis);

      if (chosenXAxis === "poverty") {
        axisNum = 0;
        povertyLabel
          .classed("active", true)
          .classed("inactive", false)
          .attr("x",0);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true)
          .attr("x",0);
      }
      else {
        axisNum = 1;
        povertyLabel
          .classed("active", false)
          .classed("inactive", true)
          .attr("x",0);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false)
          .attr("x",0);
      };

    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, cirColor[axisNum]);
    cirLabelGroup = renderCircLabel(cirLabelGroup,xLinearScale, chosenXAxis,r);

    };
    
  });



 
 
}).catch(function(error){console.log(error)}); //error handling




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

//Creating master chartgroup object
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//setting some initial values 
var chosenXAxis = "poverty"; //setting initial axis value to display on graph
var chosenYAxis  = "healthcare";
var axisXNum = 0;
cirColor = ["lightblue", "yellow"]
var axisYNum = 0;
cirLine = ["yellow", "lightblue"]

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
// function used for updating y-scale var upon click on axis label
function yScale(passData,chosenAxis) {
  //create scales
  var yLinearScale = d3.scaleLinear()
    // Axis is set to have minimum at 85% of data minimum and 115% of maximum so looks nicely placed on axis
      .domain([d3.min(passData, d => d[chosenAxis])*0.70, d3.max(passData, d => d[chosenAxis])*1.15])
      .range([height, 0]);
    return yLinearScale
};
//**********************************************************************/
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

//**********************************************************************/
// function used for updating YAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
};
//**********************************************************************/
// function used for updating circles when switch x-axis
function renderXCircles(circlesGroup, newXScale, chosenXAxis, cirColor) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("fill", cirColor);
  return circlesGroup;
};

//**********************************************************************/
// function used for updating circles when switch y-axis
function renderYCircles(circlesGroup, newYScale, chosenYAxis, cirColor) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))
    .attr("fill", cirColor);
  return circlesGroup;
};
//**********************************************************************/
//function used for updating label of circles (state abbreviation)
//for x axis using render function clears previous marker location
function renderXCircLabel(cirLabelGroup,newXScale, chosenAxis,r) {
  cirLabelGroup.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenAxis])-r/2)
  .attr("fill", "darkblue");
  return cirLabelGroup;
  };

  //**********************************************************************/
//function used for updating label of circles (state abbreviation)
//using for y axis render function clears previous marker location
function renderYCircLabel(cirLabelGroup,newYScale, chosenAxis,r) {
  cirLabelGroup.transition()
  .duration(1000)
  .attr("y", d => newYScale(d[chosenAxis])+r/2)
  .attr("fill", "darkblue");
  return cirLabelGroup;
  };

///*******************Loading Data into d3******************/
var url = "./assets/data/data.csv"; //location of data

d3.csv(url).then(function(healthData) {
    
  //code below is used to check input data set on console - used for debugging
    console.log(Object.keys(healthData[0])); //for error checking and to verify keys
    // for (i = 0; i<healthData.length; i++) {
    //     console.log(healthData[i].state + " abbr:  " + healthData[i].abbr);
    //  };
    console.log(healthData[1].healthcare)
    
    //making certain all data is in number not string.
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
      });

    //*******setting up initial plot with default data********************

    //setting x axis values
    var xLinearScale = xScale(healthData, chosenXAxis);
    //setting y axis values
    var yLinearScale = yScale(healthData,chosenYAxis);
    
    //assigning bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //adding x axis into html
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    
    // adding y axis into html
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
  //Drawing data points
  var r = 12; //radius for circles

  //inserting circles into html using svg
  //chosenXAxis is the intial set parameter    
  var circlesGroup = chartGroup.selectAll(".circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", r)
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("fill", "lightblue")
    .attr("opacity", "0.50");
    
//Setting labels (state abbreviation) for points
var cirLabelGroup = chartGroup.selectAll(".text") 
  .data(healthData)
  .enter()
  .append("text") 
  .attr("x", d => xLinearScale(d[chosenXAxis])-r/2) //offsetting by radius to get correct placement of points
  .attr("y", d => yLinearScale(d[chosenYAxis])+r/2)
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("fill", "black")
  .text( function(d) {
      return (d.abbr);
  });

//setting up y axis labels
var labelsYGroup = chartGroup.append("g");
// Create axes labels
var healthcareLabel = labelsYGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left +20)
   .attr("x", 0 - (height / 2 + 00))
   .attr("dy", "1em")
   .attr("value", "healthcare")
   .attr("class", "axisText")
   .classed("active",true)
   .classed("inactive", false)
   .text("% Lacking Healthcare");

var obesityLabel = labelsYGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left +45)
   .attr("x", 0 - (height / 2 +00 ))
   .attr("dy", "1em")
   .attr("value", "obesity")
   .attr("class", "axisText")
   .classed("active", false)
  .classed("inactive", true)
   .text("% with Obesity");


var labelsXGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`);

//Placing x axis labels
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
    .html(function(d) {
      return (`${d.state}<br>% Poverty: ${d.poverty}<br> Median Income: ${d.income}<br> \
      % Lacking Healthcare: ${d.healthcare} <br>% Obesisty ${d.obesity}`);
    });

//  Create tooltip in the chart
// ==============================
  chartGroup.call(toolTip);

//  Create event listeners to display and hide the tooltip.  Use mouse over because seems easier to use (finding point)
// ==============================
  circlesGroup.on("mouseover", function(data) {
    d3.select(this).attr("opacity", "1");//make fill solid
    d3.select(this).attr("fill", cirColor[(1-axisXNum)]);//change color
    toolTip.show(data, this)
    .style("background",cirColor[(1-axisXNum)]);//makes circle and tool tip data box have same color
  })
// onmouseout event - clearing on mouse out
    .on("mouseout", function(data, index) {
      d3.select(this).attr("opacity", "0.50");//back to original opacity
      d3.select(this).attr("fill", cirColor[axisXNum]);//back to original color
      toolTip.hide(data);
    });


//Selecting X axis value with mouse
labelsXGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");//"this" refers to selected element
    if (value !== chosenXAxis) {

      chosenXAxis = value;
      //redrawing axis
      xLinearScale = xScale(healthData, chosenXAxis);
      xAxis = renderXAxes(xLinearScale,xAxis);

      //setting parameters for chosen axis and not selected for visibility
      if (chosenXAxis === "poverty") {
        axisXNum = 0;
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
        axisXNum = 1;
        povertyLabel
          .classed("active", false)
          .classed("inactive", true)
          .attr("x",0);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false)
          .attr("x",0);
      };
    
    //redrawing data points and state labels
    circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis, cirColor[axisXNum]);
    cirLabelGroup = renderXCircLabel(cirLabelGroup,xLinearScale, chosenXAxis,r);

    };
  });

//  //Selecting Y axis value with mouse
labelsYGroup.selectAll("text")
.on("click", function() {
  var value = d3.select(this).attr("value");//"this" refers to selected element
  if (value !== chosenYAxis) {

    chosenYAxis = value;
    yLinearScale = yScale(healthData, chosenYAxis);
    yAxis = renderYAxes(yLinearScale,yAxis);

    if (chosenYAxis === "healthcare") {
      axisYNum = 0;
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false)
        .attr("y",-80);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true)
        .attr("y",-60);
    }
    else {
      axisYNum = 1;
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true)
        .attr("y",-80);
        obesityLabel
        .classed("active", true)
        .classed("inactive", false)
        .attr("y",-60);
    };
  //redrawing circles and state labels (after change of axis)
  circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis, cirColor[axisXNum]);
  cirLabelGroup = renderYCircLabel(cirLabelGroup,yLinearScale, chosenYAxis,r);

  };
    
  });


//catching and logging errors 
}).catch(function(error){console.log(error)}); //error handling




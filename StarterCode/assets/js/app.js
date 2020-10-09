// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

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

var chosenXAxis = "poverty"; //setting initial axis

// function used for updating x-scale var upon click on axis label
function xScale(passData,chosenAxis) {
  //create scales
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(passData, d => d[chosenAxis])*0.9, d3.max(passData, d => d[chosenAxis])*1.1])
      .range([0, width]);
    return xLinearScale

};

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenAxis]));

  return circlesGroup;
};

function renderCircLabel(cirLabelGroup,newXScale, chosenAxis) {
  cirLabelGroup.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenAxis]));

  return cirLabelGroup;
  };


var url = "./assets/data/data.csv";

d3.csv(url).then(function(healthData) {
    
    console.log(Object.keys(healthData[0]));
    
    // console.log(dataKeys);
    for (i = 0; i<healthData.length; i++) {
        console.log(healthData[i].state + " abbr:  " + healthData[i].abbr);
     };

    console.log(healthData[1].healthcare)
    
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

    var xLinearScale = xScale(healthData, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

   
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

   
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    var r = 10;
       // Step 5: Create Circles
    // ==============================
  var circlesGroup = chartGroup.selectAll(".circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", r)
    // .text( d=>(d.abbr))
    .attr("fill", "lightblue")
    .attr("opacity", "0.75");
    

var cirLabelGroup = chartGroup.selectAll(".circle") 
  .data(healthData)
  .enter()
  .append("text") 
  .attr("x", d => xLinearScale(d[chosenXAxis])-r/2)
  .attr("y", d => yLinearScale(d.healthcare)+r/2)
  .attr("font-family", "sans-serif")
  .attr("font-size", "8px")
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

var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`);

var povertyLabel = labelsGroup.append("text")
  .attr("x",0)
  .attr("y",20)
  .attr("value", "poverty")//value for event listener
  .classed("active",true)
  .text("% in Poverty");

var incomeLabel = labelsGroup.append("text")
  .attr("x",0)
  .attr("y",40)
  .attr("value", "income")//value for event listener
  .classed("active",true)
  .text("House Hold Median Income");

labelsGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      chosenXAxis = value;
      xLinearScale = xScale(healthData, chosenXAxis);
      xAxis = renderAxes(xLinearScale,xAxis);

      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      cirLabelGroup = renderCirLabel(cirLabelGroup,xLinearScale, chosenXAxis);

      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
    
  });

//

  
    
//  Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacking Healthcare: ${d.healthcare}`);
      });
//  Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

//  Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

 

    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    //   .attr("class", "axisText")
    //   .text("% in Poverty");

}).catch(function(error){console.log(error)});




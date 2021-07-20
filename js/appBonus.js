var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
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

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// ================= Build multiple X axis =============
// Initial Params x-axis
var chosenXAxis = "In_Poverty";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with new tooltip
function updateXToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "In_Poverty") {
      label = "In Poverty (%)";
    }
    else if (chosenXAxis === "Age") {
      label = "Age (Mean)";
    }
    else {
        label = "Household Income (Mean)"
    }
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
});
circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
  toolTip.show(data);
})
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

return circlesGroup;
};

// ================get data==============
d3.csv("data/data.csv").then(function(data, err) {
    if (err) throw err;
    console.log("data", data)

        // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d){
        d.id = +d.id;
        d.age = +d.age;
        d.ageMoe = +d.ageMoe;
        d.healthcare = +d.healthcare;
        d.healthcareLow = +d.healthcareLow;
        d.healthcareHigh = +d.healthcareHigh;
        d.income = +d.income;
        d.incomeMoe = +d.incomeMoe;
        d.obesity = +d.obesity;
        d.obesityHigh = +d.obesityHigh;
        d.obesityLow = +d.obesityLow;
        d.poverty = +d.poverty;
        d.povertyMoe = +d.povertyMoe;
        d.smokes = +d.smokes;
        d.smokesHigh = +d.smokesHigh;
        d.smokesLow = +d.smokesLow
    })

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = xScale(data, chosenYAxis).range([height, 0]);
    // .domain([0, d3.max(data, chosenYAxis)])
    // .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "In_Poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "Age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Mean)");


    var House_incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("value", "Age") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Mean)");

  // append y axis
  var obeseLabel =  labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -490 )
    .attr("x", 300)
    .attr("value", "Obese") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

    var smokeLable =  labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -465 )
    .attr("x", 300)
    .attr("value", "Smoke") // value to grab for event listener
    .classed("inactive", true)
    .text("Smoke (%)");

    var smokeLable =  labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -445 )
    .attr("x", 300)
    .attr("value", "Smoke") // value to grab for event listener
    .classed("inactive", true)
    .text("Lack of Healthcare (%)");
    
      // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "In_Poverty") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


}).catch(function(error) {
    console.log(error);
  });
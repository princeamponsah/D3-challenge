var svgWidth = 960;
var svgHeight = 500;

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

// ================= do the same for Y axis =============
var chosenYAxis = "Obese";

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, width]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var bottomAxis = d3.axisBottom(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return yAxis;
  }

  // function used for updating circles group with a transition to
// new circles
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
};

// function used for updating circles group with new tooltip
function updateYToolTip(chosenYAxis, circlesGroup) {

    var label;
  
    if (chosenYAxis === "Obese") {
      label = "Obese (%)";
    }
    else if (chosenXAxis === "Smoke") {
      label = "Smoke (%)";
    }
    else {
        label = "Lacks Healthcare (%)"
    }
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenYAxis]}`);
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
}

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
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, chosenYAxis)])
    .range([height, 0]);
















}).catch(function(error) {
    console.log(error);
  });
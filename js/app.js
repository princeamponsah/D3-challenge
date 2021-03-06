// @TODO: YOUR CODE HERE!

d3.select(window).on("resize", makeResponsive);

function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
    makeChart();
  }
}


makeChart();


function makeChart() {


  var svgWidth = window.innerWidth / 2;
  var svgHeight = window.innerHeight / 2;

  var margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 120
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // upload data
  d3.csv("data/data.csv").then(function (data) {
    console.log("data", data)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function (d) {
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

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([(d3.min(data, d => d.poverty) - 1), d3.max(data, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcareHigh)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "green")
      .attr("opacity", ".3");

    // Step 5: Create text
    // ==============================
    var textGroup = chartGroup.append("g")
      .attr("class", "stateText aText")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare) + 4)
      .text(d => d.abbr)




    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Lack of Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    textGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText active")
      .text("Lack of Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText active")
      .text("In Poverty (%)");
  }).catch(function (error) {
    console.log(error);
  });

}
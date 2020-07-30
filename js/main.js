var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var all = d3
  .line()
  .defined((d) => !isNaN(d.all) && d.all > 0)
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.all);
  });

var white = d3
  .line()
  .defined((d) => !isNaN(d.white) && d.white > 0)
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.white);
  });

var black = d3
  .line()
  .defined((d) => !isNaN(d.black) && d.black > 0)
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.black);
  });

var asian = d3
  .line()
  .defined((d) => !isNaN(d.asian) && d.asian > 0)
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.asian);
  });

var hispanic = d3
  .line()
  .defined((d) => !isNaN(d.hispanic) && d.hispanic > 0)
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.hispanic);
  });
var svg = d3
  .select("#income-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/household-income.csv").then(function (data) {
  data.forEach(function (d) {
    d.year = parseTime(d.year);
    d.all = +d.all;
    d.white = +d.white;
    d.black = +d.black;
    d.asian = +d.asian;
    d.hispanic = +d.hispanic;
  });
  var startYear = new Date(1960, 0, 1, 0, 0, 0, 0);
  var endYear = new Date(2020, 0, 1, 0, 0, 0, 0);
  x.domain([startYear, endYear]);
  y.domain([0, 90000]);
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#1f77b4")
    .attr("d", all);

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#a93e3e")
    .attr("d", white);

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#ff7f0e")
    .attr("d", black);

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#ffbb78")
    .attr("d", asian);

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#2ca02c")
    .attr("d", hispanic);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));
});

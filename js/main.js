var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

function createChart(edu) {
  d3.select("#income-chart svg").remove();
  var svg = d3
    .select("#income-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var all = d3
    .line()
    .defined((d) => !isNaN(d["all-" + edu]) && d["all-" + edu] > 0)
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d["all-" + edu]);
    });

  var white = d3
    .line()
    .defined((d) => !isNaN(d["white-" + edu]) && d["white-" + edu] > 0)
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d["white-" + edu]);
    });

  var black = d3
    .line()
    .defined((d) => !isNaN(d["black-" + edu]) && d["black-" + edu] > 0)
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d["black-" + edu]);
    });

  var asian = d3
    .line()
    .defined((d) => !isNaN(d["asian-" + edu]) && d["asian-" + edu] > 0)
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d["asian-" + edu]);
    });

  var hispanic = d3
    .line()
    .defined((d) => !isNaN(d["hispanic-" + edu]) && d["hispanic-" + edu] > 0)
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d["hispanic-" + edu]);
    });

  d3.csv("data/household-income.csv").then(function (data) {
    data.forEach(function (d) {
      d.year = parseTime(d.year);
      d["all-" + edu] = +d["all-" + edu];
      d["white-" + edu] = +d["white-" + edu];
      d["black-" + edu] = +d["black-" + edu];
      d["asian-" + edu] = +d["asian-" + edu];
      d["hispanic-" + edu] = +d["hispanic-" + edu];
    });
    var startYear = new Date(1960, 0, 1, 0, 0, 0, 0);
    var endYear = new Date(2020, 0, 1, 0, 0, 0, 0);
    x.domain([startYear, endYear]);
    y.domain([
      0,
      d3.max(data, function (d) {
        return Math.max(
          d["all-" + edu],
          d["white-" + edu],
          d["black-" + edu],
          d["asian-" + edu],
          d["hispanic-" + edu]
        );
      }),
    ]);
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

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[51].year) - 70) +
          "," +
          y(data[51]["all-" + edu]) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#1f77b4")
      .text("All Races");

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[46].year) - 130) +
          "," +
          y(data[46]["white-" + edu]) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#a93e3e")
      .text("White, not Hispanic");

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[51].year) - 40) +
          "," +
          (y(data[51]["black-" + edu]) + 10) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#ff7f0e")
      .text("Black");

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[31].year) - 40) +
          "," +
          (y(data[31]["asian-" + edu]) + 10) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#ffbb78")
      .text("Asian");

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[46].year) - 130) +
          "," +
          (y(data[46]["hispanic-" + edu]) + 10) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#2ca02c")
      .text("Hispanic(any race)");

    var annotation =
      "Black people have the lowest median income from 1967 to 2018";
    if (edu == "bachelor") {
      annotation = "Black and Hispanic people have the lowest median income";
    }
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          x(data[30].year) +
          "," +
          (y(data[30]["black-" + edu]) + 100) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "black")
      .style("font-size", "1.2em")
      .text(annotation);

    svg
      .append("line")
      .style("stroke", "#e8336d")
      .style("stroke-width", "3px")
      .attr("x1", x(data[35].year))
      .attr("y1", y(data[35]["black-" + edu]) + 10)
      .attr("x2", x(data[30].year) - 3)
      .attr("y2", y(data[30]["black-" + edu]) + 95);

    svg
      .append("circle")
      .style("stroke", "#e8336d")
      .style("stroke-width", "1px")
      .style("stroke-dasharray", "5,3")
      .style("fill", "none")
      .attr("cx", x(data[35].year))
      .attr("cy", y(data[35]["black-" + edu]) + 10)
      .attr("r", 10);
  });
}
createChart("");

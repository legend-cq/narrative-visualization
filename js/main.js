var parseTime = d3.timeParse("%Y");

function createChart(edu, perspective) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  d3.select("#" + perspective + "-chart svg").remove();
  var svg = d3
    .select("#" + perspective + "-chart")
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
  var file = "";
  if (perspective == "income") file = "data/household-income.csv";
  if (perspective == "education") file = "data/education.csv";
  d3.csv(file).then(function (data) {
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
    ]).nice();
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
    var formatDollar = (d) => "$" + d;
    var formatpercent = (d) => d + "%";
    var tickFormat = formatDollar;
    if (perspective == "education") tickFormat = formatpercent;
    svg.append("g").call(d3.axisLeft(y).tickFormat(tickFormat));
    var minAll, minWhite, minBlack, minAsian, minHispanic;
    for (let i = 0; i < data.length; i++) {
      let d = data[i];
      if (!isNaN(d["all-" + edu]) && d["all-" + edu] > 0) minAll = i;
      if (!isNaN(d["white-" + edu]) && d["white-" + edu] > 0) minWhite = i;
      if (!isNaN(d["black-" + edu]) && d["black-" + edu] > 0) minBlack = i;
      if (!isNaN(d["asian-" + edu]) && d["asian-" + edu] > 0) minAsian = i;
      if (!isNaN(d["hispanic-" + edu]) && d["hispanic-" + edu] > 0)
        minHispanic = i;
    }
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[minAll].year) - 70) +
          "," +
          y(data[minAll]["all-" + edu]) +
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
          (x(data[minWhite].year) - 40) +
          "," +
          (y(data[minWhite]["white-" + edu]) - 10) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#a93e3e")
      .text("White");

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[minBlack].year) - 40) +
          "," +
          (y(data[minBlack]["black-" + edu]) + 10) +
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
          (x(data[minAsian].year) - 40) +
          "," +
          (y(data[minAsian]["asian-" + edu]) + 10) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#ffbb78")
      .text("Asian");
    var offset = -15;
    if (edu == "female") offset = 15;
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (x(data[minHispanic].year) - 50) +
          "," +
          (y(data[minHispanic]["hispanic-" + edu]) + offset) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#2ca02c")
      .text("Hispanic");

    var annotation = "Blacks have the lowest median income from 1967 to 2018";
    if (edu == "bachelor") {
      annotation = "Blacks and Hispanics have the lowest income alternately";
    }
    if (perspective == "education") {
      annotation = "Hispanics have the lowest college attainment rate";
    }
    if (edu == "male") {
      annotation =
        "Blacks and Hispanics have the lowest college attainment rate alternately";
    }
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          x(data[35].year) +
          "," +
          (y(data[35]["black-" + edu]) + 50) +
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
      .attr("x1", x(data[40].year))
      .attr("y1", y(data[40]["black-" + edu]) + 10)
      .attr("x2", x(data[35].year) - 3)
      .attr("y2", y(data[35]["black-" + edu]) + 45);

    svg
      .append("circle")
      .style("stroke", "#e8336d")
      .style("stroke-width", "5px")
      // .style("stroke-dasharray", "5,3")
      .style("fill", "yellow")
      .attr("cx", x(data[40].year))
      .attr("cy", y(data[40]["black-" + edu]) + 10)
      .attr("r", 10);
  });
}
createChart("total", "income");
createChart("total", "education");

function createBarChart(perspective) {
  var margin = { top: 20, right: 20, bottom: 30, left: 150 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var svg = d3
    .select("#" + perspective + "-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var y = d3.scaleBand().rangeRound([0, height]).paddingInner(0.05).align(0.1);

  var x = d3.scaleLinear().rangeRound([0, width]);

  var z = d3
    .scaleOrdinal()
    .range(["#ff7f0e", "#2ca02c", "#ffbb78", "#1f77b4", "#a93e3e"]);

  d3.csv("data/occupation.csv").then(function (data) {
    var keys = data.columns.slice(1);
    y.domain(
      data.map(function (d) {
        return d.occupation;
      })
    );
    x.domain([0, 100]).nice();
    z.domain(keys);
    svg
      .append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append("g")
      .attr("fill", (d) => z(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.data.occupation))
      .attr("x", (d) => x(d[0]))
      .attr("width", (d) => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat((d) => d + "%"));
    svg.append("g").call(d3.axisLeft(y));
    var legend = svg
      .append("g")
      .attr("transfor", "translate(0,0)")
      .selectAll("g")
      .data(keys)
      .enter()
      .append("g")
      .attr("transform", (d, i) => "translate(" + i * 100 + "," + "-20)");
    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) {
        return d;
      });
  });
}
createBarChart("occupation");

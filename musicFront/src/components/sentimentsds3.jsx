var albums = [
  {
    date: new Date('2020-01-01'),
    sentiments: {
      happy: 0.2,
      sad: 0.1,
      angry: 0.05,
      surprised: 0.1,
      fearful: 0.15,
      disgusted: 0.1,
      neutral: 0.2,
      confident: 0.05,
      relaxed: 0.025,
      excited: 0.025
    }
  },
  {
    date: new Date('2020-06-01'),
    sentiments: {
      happy: 0.25,
      sad: 0.05,
      angry: 0.1,
      surprised: 0.1,
      fearful: 0.1,
      disgusted: 0.1,
      neutral: 0.1,
      confident: 0.05,
      relaxed: 0.05,
      excited: 0.1
    }
  },
  {
    date: new Date('2021-01-01'),
    sentiments: {
      happy: 0.15,
      sad: 0.1,
      angry: 0.1,
      surprised: 0.1,
      fearful: 0.1,
      disgusted: 0.1,
      neutral: 0.2,
      confident: 0.1,
      relaxed: 0.05,
      excited: 0.1
    }
  },
  {
    date: new Date('2021-06-01'),
    sentiments: {
      happy: 0.3,
      sad: 0.05,
      angry: 0.05,
      surprised: 0.1,
      fearful: 0.1,
      disgusted: 0.1,
      neutral: 0.1,
      confident: 0.05,
      relaxed: 0.1,
      excited: 0.05
    }
  },
  {
    date: new Date('2022-01-01'),
    sentiments: {
      happy: 0.2,
      sad: 0.2,
      angry: 0.05,
      surprised: 0.1,
      fearful: 0.1,
      disgusted: 0.05,
      neutral: 0.1,
      confident: 0.05,
      relaxed: 0.1,
      excited: 0.05
    }
  }
];

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({accentColor = '#A290FC' }) => {
  const chartRef = useRef();

  useEffect(() => {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 40;

    const keys = Object.keys(albums[0].sentiments);

    const series = d3.stack()
      .offset(d3.stackOffsetExpand)
      .keys(keys)
      .value(([, values], key) => values[key])
      (albums.map(d => [d.date, d.sentiments]));

    const x = d3.scaleBand()
      .domain(albums.map(d => d.date))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3.scaleLinear()
      .rangeRound([height - marginBottom, marginTop]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeGreys[9]);

    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const bars = svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", "#101010")
      .attr("stroke", accentColor)
      .attr("stroke-width", 1)
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("fill", accentColor);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(d.data[1])
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event, d) {
        tooltip.style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("fill", "#101010");
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Create tooltip element
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Remove axes
    svg.selectAll(".axis").remove();

  }, [albums, accentColor]);

  return <svg ref={chartRef}></svg>;
};

export default StackedBarChart;

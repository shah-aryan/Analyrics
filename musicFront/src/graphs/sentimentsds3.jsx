import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const albums = [
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

const LineChart = ({ accentColor = '#A290FC', defaultColor = '#999999' }) => {
  const chartRef = useRef();

  useEffect(() => {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 40;

    const keys = Object.keys(albums[0].sentiments);

    const maxSentiment = d3.max(albums, album => d3.max(keys, key => album.sentiments[key]));

    const x = d3.scaleTime()
      .domain(d3.extent(albums, d => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, maxSentiment])
      .rangeRound([height - marginBottom, marginTop]);

    const line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(d => x(d.date))
      .y(d => y(d.value));

    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const linesGroup = svg.append("g");

    keys.forEach(key => {
      const lineData = albums.map(d => ({ date: d.date, value: d.sentiments[key] }));
      
      const path = linesGroup.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", defaultColor)
        .attr("stroke-width", 3)
        .attr("d", line)
        .attr("class", `line-${key}`);
    });

    // Tooltip element
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svg.on("mousemove", function(event) {
      const [xm, ym] = d3.pointer(event);
      let closestLine;
      let minDistance = Infinity;

      keys.forEach(key => {
        const lineData = albums.map(d => ({ date: d.date, value: d.sentiments[key] }));
        const distances = lineData.map(d => Math.hypot(x(d.date) - xm, y(d.value) - ym));
        const minLineDistance = Math.min(...distances);

        if (minLineDistance < minDistance) {
          minDistance = minLineDistance;
          closestLine = key;
        }
      });

      linesGroup.selectAll("path")
        .attr("stroke", defaultColor)
        .attr("stroke-width", 3);

      linesGroup.selectAll(`.line-${closestLine}`)
        .attr("stroke", accentColor)
        .attr("stroke-width", 5);

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`${closestLine}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    });

    svg.on("mouseleave", function() {
      linesGroup.selectAll("path")
        .attr("stroke", defaultColor)
        .attr("stroke-width", 3);

      tooltip.transition().duration(500).style("opacity", 0);
    });

  }, [accentColor, defaultColor]);

  return <svg ref={chartRef}></svg>;
};

export default LineChart;

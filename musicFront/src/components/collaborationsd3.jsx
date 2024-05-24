import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

//! final weights should be from 0-1 representing a percentile

const data = {
  nodes: [
    { id: 'Central', group: 1, info: 'Central node info', weight: 1 },
    { id: 'Node1', group: 2, info: 'Node 1 info', weight: 0.011 },
    { id: 'Node2', group: 2, info: 'Node 2 info', weight: 0.2 },
    { id: 'Node3', group: 2, info: 'Node 3 info', weight: 0.3 },
    { id: 'Node4', group: 2, info: 'Node 4 info', weight: 0.4 },
    { id: 'Node5', group: 2, info: 'Node 5 info', weight: 0.5 },
    { id: 'Node6', group: 2, info: 'Node 6 info', weight: 0.6 },
    { id: 'Node7', group: 2, info: 'Node 7 info', weight: 0.7 },
    { id: 'Node8', group: 2, info: 'Node 8 info', weight: 0.8 },
    { id: 'Node9', group: 2, info: 'Node 9 info', weight: 0.9 },
    { id: 'Node10', group: 2, info: 'Node 10 info', weight: 1 }
  ],
  links: [
    { source: 'Central', target: 'Node1', weight: 0.1 },
    { source: 'Central', target: 'Node2', weight: 0.2 },
    { source: 'Central', target: 'Node3', weight: 0.3 },
    { source: 'Central', target: 'Node4', weight: 0.4 },
    { source: 'Central', target: 'Node5', weight: 0.5 },
    { source: 'Central', target: 'Node6', weight: 0.6 },
    { source: 'Central', target: 'Node7', weight: 0.7 },
    { source: 'Central', target: 'Node8', weight: 0.8 },
    { source: 'Central', target: 'Node9', weight: 0.9 },
    { source: 'Central', target: 'Node10', weight: 1 }
  ]
};

const D3Chart = () => {
  const chartRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    const parent = chartRef.current.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    const accentColor = '#A290FC'; // Define your accent color here
    const offsetY = height * -0.1; // Adjust this value to move the center slightly down


    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => d.weight*3+2);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => 5 + (d.weight)*4+0.1) // Node size proportional to weight
      .attr("fill", d => d.id === 'Central' ? '#ffffff' : accentColor)
      .attr("stroke", d => d.id === 'Central' ? '#ffffff' : accentColor)
      .attr("stroke-width", 1.5);

    node.append("title")
      .text(d => d.id);

      const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => Math.min(width, (height-100))*0.4*((1-d.weight)+0.3))) // Distance relative to parent width
      .force("charge", d3.forceManyBody().strength(-height / 5)) // Charge strength relative to parent height
      .force("center", d3.forceCenter(width / 2, height / 2 + offsetY)) // Center force with offset
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2 + offsetY).strength(0.05));


    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

    node.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

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

    // Show tooltip on hover
    node.on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`<strong>${d.id}</strong><br>${d.info}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    });

    // Move tooltip with mouse
    node.on("mousemove", (event, d) => {
      tooltip.style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    });

    // Hide tooltip on mouseout
    node.on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Store the simulation reference to stop it later
    simulationRef.current = simulation;

    // Cleanup on unmount
    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
      tooltip.remove();
    };
  }, []);

  return (
    <svg ref={chartRef}></svg>
  );
};

export default D3Chart;

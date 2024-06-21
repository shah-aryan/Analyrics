import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const D3Chart = ({ artistName = "Error", numSongs = 1, collaborations = {} }) => {
  const [names, setNames] = useState(["name1", "name2", "name3", "name4", "name5", "name6", "name7", "name8", "name9", "name10"]);
  const hasFetchedData = useRef(false);
  const chartRef = useRef();
  const simulationRef = useRef();

  const top10Collaborations = useMemo(() => {
    const collaborationsArray = Object.entries(collaborations);
    collaborationsArray.sort((a, b) => b[1] - a[1]);

    // Remove self collaborations
    for (let i = 0; i < collaborationsArray.length; i++) {
      if (collaborationsArray[i][0] === artistName) {
        collaborationsArray.splice(i, 1);
        break;
      }
    }

    return collaborationsArray.slice(0, 10);
  }, [collaborations]);

  useEffect(() => {
    if (top10Collaborations.length < 2) {
      return;
    }

    const ids = top10Collaborations.map(collab => collab[0]);

    if (!hasFetchedData.current && ids.length >= 2) {
      console.log('Sending request with ids:', ids);
      axios.post('http://localhost:5555/lookup', { ids })
        .then(response => {
          if (response.status === 200) {
            console.log('Response data:', response.data);
            setNames(response.data);
            hasFetchedData.current = true;
          } else {
            console.error('Unexpected response:', response);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [top10Collaborations]);

  useEffect(() => {
    if (names.length < 10) {
      setNames(prevNames => [...prevNames, ...Array(10 - prevNames.length).fill("name")]);
    }
  }, [names]);

  if (top10Collaborations.length < 2) {
    return <div className="flex h-full w-full justify-center mt-32">Too few Collaborations Found</div>;
  }

  const maxCollaborations = top10Collaborations[0][1];
  const weights = top10Collaborations.map(collab => collab[1] / maxCollaborations);
  while (weights.length < 10) {
    weights.push(0);
  }

  const nodes = [
    { id: artistName, group: 1, info: `${numSongs} songs`, weight: 1.3 }
  ];
  const links = [];

  for (let index = 0; index < top10Collaborations.length; index++) {
    const collabName = names[index];
    const collabCount = top10Collaborations[index][1];
    const collabWeight = weights[index];

    if (collabName !== artistName) {
      nodes.push({
        id: collabName,
        group: 2,
        info: `${collabCount} collaborations`,
        weight: collabWeight
      });

      links.push({
        source: artistName,
        target: collabName,
        weight: collabWeight
      });
    }
  }

  const data = {
    nodes,
    links
  };

  useEffect(() => {
    const renderChart = () => {
      const parent = chartRef.current.parentElement;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const accentColor = '#A290FC';
      const offsetY = height * -0.1;

      d3.select(chartRef.current).selectAll("*").remove();

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
        .attr("stroke-width", d => d.weight * 3 + 2);

      const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => 5 + d.weight * 4 + 0.1)
        .attr("fill", d => d.id === artistName ? '#ffffff' : accentColor)
        .attr("stroke", d => d.id === artistName ? '#ffffff' : accentColor)
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer");

      node.append("title").text(d => d.id);

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => Math.min(width, (height - 100)) * 0.4 * ((1.2 - d.weight))))
        .force("charge", d3.forceManyBody().strength(-height / 5))
        .force("center", d3.forceCenter(width / 2, height / 2 + offsetY))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2 + offsetY).strength(0.05))
        .alpha(1.4)
        .alphaDecay(0.01);

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

      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

      node.on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`<strong>${d.id}</strong><br>${d.info}`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

      node.on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

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

      simulationRef.current = simulation;

      return () => {
        simulation.stop();
        svg.selectAll("*").remove();
        tooltip.remove();
      };
    };

    renderChart();
    window.addEventListener('resize', renderChart);

    return () => {
      window.removeEventListener('resize', renderChart);
    };
  }, [names, data]);

  return <svg ref={chartRef}></svg>;
};

export default D3Chart;

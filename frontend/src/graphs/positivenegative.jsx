import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ sentiments, positiveColor = '#191919', negativeColor = '#191919', borderColor = '#3d3d3d', neutralColor = '#E6E6E6', accentColor = '#A290FC' }) => {
  const positiveWords = sentiments[5];
  const negativeWords = sentiments[6];
  const totalWords = positiveWords + negativeWords;
  const data = [
    { type: 'Positive Words', count: positiveWords },
    { type: 'Negative Words', count: negativeWords }
  ];

  const ref = useRef();

  const renderChart = () => {
    const parent = ref.current.parentElement;
    const width = parent.clientWidth - 32;
    const height = parent.clientHeight - 120;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear any existing SVG elements
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.type))
      .range([positiveColor, negativeColor]);

    const pie = d3.pie()
      .value(d => d.count)
      .sort((a, b) => a.type.localeCompare(b.type)); // Ensure positive is first

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.type))
      .attr('stroke', borderColor)
      .attr('stroke-width', '4px');

    svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('fill', neutralColor)
      .text(d => `${d.data.type.split(' ')[0]} ${Math.round((d.data.count / totalWords) * 100)}%`);
  };

  useEffect(() => {
    renderChart();
    window.addEventListener('resize', renderChart);

    return () => {
      window.removeEventListener('resize', renderChart);
    };
  }, [positiveWords, negativeWords, positiveColor, negativeColor, borderColor, neutralColor, accentColor]);

  return (
    <div className="w-full h-full relative p-4">
      <svg ref={ref}></svg>
    </div>
  );
};

export default PieChart;

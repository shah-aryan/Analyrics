import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const all_emotions = [
  'Fear', 'Anger', 'Anticipation', 'Trust', 
  'Surprise', 'Positive', 'Negative', 'Sadness', 
  'Disgust', 'Joy'
];

const SentimentsBubble = ({ values }) => {
  const svgRef = useRef();
  const outlineColor = '#3D3D3D'; 

  const renderChart = () => {
    const parent = svgRef.current.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight - 40;
    const accentColor = '#A290FC'; 
    const base200 = '#191919'; 
    const neutralColor = '#E6E6E6'; 

    const data = values.map((value, index) => ({
      name: all_emotions[index],
      size: value
    }));

    // Remove indexes 5 and 6 from this array
    data.splice(5, 2);

    const pack = d3.pack()
      .size([width, height])
      .padding(5);

    const root = d3.hierarchy({ children: data })
      .sum(d => d.size)
      .sort((a, b) => b.value - a.value);

    const nodes = pack(root).leaves();

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const bubble = svg.append('g')
      .attr('transform', `translate(${width / 2},${height  / 2 + 10})`);

    bubble.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', d => d.x - width / 2)
      .attr('cy', d => d.y - height / 2 - 30)
      .attr('r', d => d.r)
      .attr('fill', base200)
      .attr('stroke', outlineColor)
      .attr('stroke-width', 2)
      .attr('class', d => 'bubble-' + d.data.name.replace(/ /g, '-'))
      .on('mouseover', function(_, d) {
        d3.select(this).attr('stroke', accentColor);
        d3.selectAll(`.text-${d.data.name.replace(/ /g, '-')}`).style('fill', accentColor);
      })
      .on('mouseout', function(_, d) {
        d3.select(this).attr('stroke', outlineColor);
        d3.selectAll(`.text-${d.data.name.replace(/ /g, '-')}`).style('fill', neutralColor);
      });

    bubble.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', d => d.x - width / 2)
      .attr('y', d => d.y - height / 2 - 30)
      .attr('dy', '-0.2em')
      .style('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('class', d => 'text-' + d.data.name.replace(/ /g, '-'))
      .style('fill', neutralColor)
      .style('font-size', d => d.r / 3.2)
      .on('mouseover', function(_, d) {
        d3.select('.bubble-' + d.data.name.replace(/ /g, '-')).attr('stroke', accentColor);
        d3.selectAll(`.text-${d.data.name.replace(/ /g, '-')}`).style('fill', accentColor);
      })
      .on('mouseout', function(_, d) {
        d3.select('.bubble-' + d.data.name.replace(/ /g, '-')).attr('stroke', outlineColor);
        d3.selectAll(`.text-${d.data.name.replace(/ /g, '-')}`).style('fill', neutralColor);
      });

    bubble.selectAll('text.value')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', d => d.x - width / 2)
      .attr('y', d => d.y - height / 2 - 30)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .text(d => d.data.size + " words")
      .attr('class', d => 'text-' + d.data.name.replace(/ /g, '-'))
      .style('fill', neutralColor)
      .style('font-size', d => d.r / 4.2)
      .on('mouseover', function(_, d) {
        d3.select('.bubble-' + d.data.name.replace(/ /g, '-')).attr('stroke', accentColor);
        d3.selectAll(`.text-${d.data.name.replace(/ /g, '-')}`).style('fill', accentColor);
      })
      .on('mouseout', function(_, d) {
        d3.select('.bubble-' + d.data.name.replace(/ /g, '-')).attr('stroke', outlineColor);
        d3.selectAll(`.text-${d.data.name.replace(/ /g, '-')}`).style('fill', neutralColor);
      });
  };

  useEffect(() => {
    renderChart();
    window.addEventListener('resize', renderChart);

    return () => {
      window.removeEventListener('resize', renderChart);
    };
  }, [values]);

  return (
    <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
  );
};

export default SentimentsBubble;

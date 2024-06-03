import React, { useEffect } from 'react';
import WordCloud from 'react-d3-cloud';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

const WordCloudComponent = ({ words = [], weights = [], accentColor = "#A290FC" }) => {
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);
  const sizeScale = scaleLinear()
                    .domain([minWeight, maxWeight])
                    .range([10, 60]);

  const data = words.map((word, index) => ({
    text: word,
    value: sizeScale(weights[index]),
    count: weights[index],
  }));

  const fontSizeMapper = word => word.value;
  const rotate = () => 0;

  const width = 350;
  const height = 200;

  return (
    <div className="word-cloud relative">
      <WordCloud
        data={data}
        width={width}
        height={height}
        font="Manrope"
        fontSize={fontSizeMapper}
        fontStyle="bold"
        fontWeight="normal"
        rotate={rotate}
        padding={3}
        fill={(word, index) => ("#999999")}
        onWordClick={(event, d) => {}}
        onWordMouseOver={(event, d) => {
          
          select(event.target)
            .style('cursor', 'pointer')
            .style('fill', accentColor);
          
        }}
        onWordMouseOut={(event, d) => {
          select(event.target).style('fill', '#999999');
        }}
      />
    </div>
  );
};

export default WordCloudComponent;

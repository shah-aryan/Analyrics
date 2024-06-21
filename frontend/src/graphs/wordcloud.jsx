import React, { useEffect, useState, useRef } from 'react';
import WordCloud from 'react-d3-cloud';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

const WordCloudComponent = ({ words_obj = [], accentColor = "#A290FC" }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight-80,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!Array.isArray(words_obj) || !words_obj.every(item => Array.isArray(item) && item.length === 2)) {
    console.error("words_obj should be an array of arrays with two elements each.");
    return null;
  }

  const words = [];
  const weights = [];

  for (let i = 0; i < words_obj.length; i++) {
    words.push(words_obj[i][0]);
    weights.push(words_obj[i][1]);
  }



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

  return (
    <div ref={containerRef} className="word-cloud w-full h-full relative p-8 pt-4">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <WordCloud
          data={data}
          width={dimensions.width}
          height={dimensions.height}
          font="Manrope"
          fontSize={fontSizeMapper}
          fontStyle="bold"
          fontWeight="normal"
          rotate={rotate}
          padding={3}
          fill="#999999"
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
      )}
    </div>
  );
};

export default WordCloudComponent;

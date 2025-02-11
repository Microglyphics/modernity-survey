import React, { useState } from 'react';
import LayerControls from './LayerControls.jsx';
import { LABEL_POSITIONS, getPointOnEdge, ternaryToCartesian } from './utils.js';

const TernaryPlot = ({ analysisData, questions, responses }) => {
  const [layers, setLayers] = useState({
    baseline: true,
    gridLines: true,
    mixTriangle: true,
    shading: true
  });

  const width = 800;
  const height = 700;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const vertices = {
    top: { x: plotWidth / 2 + margin.left, y: margin.top },
    left: { x: margin.left, y: height - margin.bottom },
    right: { x: width - margin.right, y: height - margin.bottom }
  };

  const convertCoords = ternaryToCartesian(vertices);

  const generateShading = () => {
    const shadingElements = [];
    
    // Define vertex configurations for each region
    const vertexConfigs = [
        {
            name: 'modern',
            vertex: vertices.top,
            edge1: vertices.left,
            edge2: vertices.right,
            color: '#90EE90'  // Light green
        },
        {
            name: 'premodern',
            vertex: vertices.right,
            edge1: vertices.top,
            edge2: vertices.left,
            color: '#90EE90'
        },
        {
            name: 'postmodern',
            vertex: vertices.left,
            edge1: vertices.top,
            edge2: vertices.right,
            color: '#90EE90'
        }
    ];

    vertexConfigs.forEach(config => {
        // Strong region (>70%)
        const point70Edge1 = getPointOnEdge(config.vertex, config.edge1, 0.3); // 70-30 split
        const point70Edge2 = getPointOnEdge(config.vertex, config.edge2, 0.3);

        shadingElements.push(
            <path
                key={`${config.name}-strong`}
                d={`M ${config.vertex.x},${config.vertex.y} 
                    L ${point70Edge1.x},${point70Edge1.y} 
                    L ${point70Edge2.x},${point70Edge2.y} Z`}
                fill={config.color}
                opacity="0.2"
            />
        );

        // Moderate region (50-70%)
        const point50Edge1 = getPointOnEdge(config.vertex, config.edge1, 0.5); // 50-50 split
        const point50Edge2 = getPointOnEdge(config.vertex, config.edge2, 0.5);

        shadingElements.push(
            <path
                key={`${config.name}-moderate`}
                d={`M ${point70Edge1.x},${point70Edge1.y} 
                    L ${point50Edge1.x},${point50Edge1.y} 
                    L ${point50Edge2.x},${point50Edge2.y}
                    L ${point70Edge2.x},${point70Edge2.y} Z`}
                fill="#E8EB10"  // Light yellow
                opacity="0.2"
            />
        );
    });

    return shadingElements;
  };

  const generateBaselineWithScales = () => {
    const elements = [];
    
    // Base triangle
    elements.push(
        <path
            key="base-triangle"
            d={`M ${vertices.left.x},${vertices.left.y} 
               L ${vertices.top.x},${vertices.top.y} 
               L ${vertices.right.x},${vertices.right.y} 
               L ${vertices.left.x},${vertices.left.y}`}
            stroke="black"
            strokeWidth="2"
            fill="none"
        />
    );

    // Labels with tested positions
    elements.push(
        // PreModern label (bottom)
        <text 
            key="premodern-label" 
            x={(vertices.left.x + vertices.right.x) - 20} 
            y={vertices.left.y + 40} 
            textAnchor="end"
        >
            PreModern ▶
        </text>,
        
        // PostModern label (left side)
        <text 
            key="postmodern-label"
            x={margin.left + LABEL_POSITIONS.postmodern.x}
            y={height - margin.bottom + LABEL_POSITIONS.postmodern.y}
            textAnchor="end"
            transform={`rotate(${LABEL_POSITIONS.postmodern.r} ${margin.left + LABEL_POSITIONS.postmodern.x} ${height - margin.bottom + LABEL_POSITIONS.postmodern.y})`}
        >
            ◀ Postmodern
        </text>,

        // Modern label (right side)
        <text 
            key="modern-label"
            x={vertices.right.x + LABEL_POSITIONS.modern.x}
            y={height - margin.bottom + LABEL_POSITIONS.modern.y}
            textAnchor="end"
            transform={`rotate(${LABEL_POSITIONS.modern.r} ${vertices.right.x + LABEL_POSITIONS.modern.x} ${height - margin.bottom + LABEL_POSITIONS.modern.y})`}
        >
            ◀ Modern
        </text>
    );

    // Add tick marks for each side
    for (let i = 0; i <= 10; i++) {
        const ratio = i / 10;
        
        // Bottom ticks
        const bottomX = vertices.left.x + (vertices.right.x - vertices.left.x) * ratio;
        elements.push(
            <line
                key={`bottom-tick-${i}`}
                x1={bottomX}
                y1={vertices.left.y}
                x2={bottomX}
                y2={vertices.left.y + 5}
                stroke="black"
                strokeWidth="1"
            />
        );

        // Left side ticks
        const leftX = vertices.left.x + (vertices.top.x - vertices.left.x) * ratio;
        const leftY = vertices.left.y - (vertices.left.y - vertices.top.y) * ratio;
        const leftTickLength = 5;
        elements.push(
            <line
                key={`left-tick-${i}`}
                x1={leftX}
                y1={leftY}
                x2={leftX - leftTickLength * Math.sqrt(3)/2}
                y2={leftY + leftTickLength * 0.5}
                stroke="black"
                strokeWidth="1"
            />
        );

        // Right side ticks
        const rightX = vertices.right.x - (vertices.right.x - vertices.top.x) * ratio;
        const rightY = vertices.right.y - (vertices.right.y - vertices.top.y) * ratio;
        const rightAngle = -Math.PI / 3; // -60 degrees
        elements.push(
            <line
                key={`right-tick-${i}`}
                x1={rightX}
                y1={rightY}
                x2={rightX + 5 * Math.cos(rightAngle)}
                y2={rightY + 5 * Math.sin(rightAngle)}
                stroke="black"
                strokeWidth="1"
            />
        );
    }

    return elements;
};

  const plotPoint = convertCoords(...analysisData.scores);

  // Add the grid lines generation function
  const generateGridLines = () => {
    const gridElements = [];

    // Helper function to find intersection with triangle edges
    const getIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator === 0) return null;
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        if (t < 0 || t > 1) return null;
        
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    };

    for (let i = 1; i < 10; i++) {
        const ratio = i / 10;
        
        // Right parallel lines (bottom to top-left)
        let startX = vertices.left.x + (vertices.right.x - vertices.left.x) * ratio;
        let startY = vertices.left.y;
        let endX = startX + (vertices.top.x - vertices.left.x);
        let endY = vertices.top.y;
        
        // Find intersections with triangle edges
        const rightIntersections = [
            getIntersection(startX, startY, endX, endY, 
                        vertices.left.x, vertices.left.y, 
                        vertices.right.x, vertices.right.y),
            getIntersection(startX, startY, endX, endY, 
                        vertices.top.x, vertices.top.y, 
                        vertices.right.x, vertices.right.y),
            getIntersection(startX, startY, endX, endY, 
                        vertices.left.x, vertices.left.y, 
                        vertices.top.x, vertices.top.y)
        ].filter(p => p !== null);

        if (rightIntersections.length >= 2) {
            gridElements.push(
                <line
                    key={`right-${i}`}
                    x1={rightIntersections[0].x}
                    y1={rightIntersections[0].y}
                    x2={rightIntersections[1].x}
                    y2={rightIntersections[1].y}
                    stroke="#ff0000"
                    strokeWidth="1"
                    opacity="0.4"
                />
            );
        }

        // Left parallel lines (bottom to top-right)
        startX = vertices.left.x + (vertices.right.x - vertices.left.x) * (1 - ratio);
        startY = vertices.left.y;
        endX = startX - (vertices.right.x - vertices.top.x);
        endY = vertices.top.y;
        
        const leftIntersections = [
            getIntersection(startX, startY, endX, endY,
                        vertices.left.x, vertices.left.y,
                        vertices.right.x, vertices.right.y),
            getIntersection(startX, startY, endX, endY,
                        vertices.top.x, vertices.top.y,
                        vertices.left.x, vertices.left.y),
            getIntersection(startX, startY, endX, endY,
                        vertices.top.x, vertices.top.y,
                        vertices.right.x, vertices.right.y)
        ].filter(p => p !== null);

        if (leftIntersections.length >= 2) {
            gridElements.push(
                <line
                    key={`left-${i}`}
                    x1={leftIntersections[0].x}
                    y1={leftIntersections[0].y}
                    x2={leftIntersections[1].x}
                    y2={leftIntersections[1].y}
                    stroke="#ff0000"
                    strokeWidth="1"
                    opacity="0.4"
                />
            );
        }

        // Bottom parallel lines
        startX = vertices.left.x + (vertices.top.x - vertices.left.x) * ratio;
        startY = vertices.left.y - (vertices.left.y - vertices.top.y) * ratio;
        endX = vertices.right.x - (vertices.right.x - vertices.top.x) * ratio;
        endY = startY;
        
        // Only add if line is inside triangle
        if (startY >= vertices.top.y && startY <= vertices.left.y) {
            gridElements.push(
                <line
                    key={`bottom-${i}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#ff0000"
                    strokeWidth="1"
                    opacity="0.4"
                />
            );
        }
    }
    
    return gridElements;
  };

  const generateMixTriangle = () => {
    // Calculate 50% points on each side
    const leftSide50 = getPointOnEdge(vertices.left, vertices.top, 0.5);
    const rightSide50 = getPointOnEdge(vertices.right, vertices.top, 0.5);
    const bottomSide50 = getPointOnEdge(vertices.left, vertices.right, 0.5);

    return (
      <path
        key="mix-triangle"
        d={`M ${bottomSide50.x},${bottomSide50.y} 
            L ${leftSide50.x},${leftSide50.y} 
            L ${rightSide50.x},${rightSide50.y} 
            Z`}
        stroke="#ff0000"
        strokeWidth="2"
        fill="none"
      />
    );
  };

  return (
    <div className="relative">
      <LayerControls layers={layers} setLayers={setLayers} />
      <svg width={width} height={height} className="bg-white mx-auto" viewBox={`0 0 ${width} ${height}`}>
        {layers.shading && generateShading()}
        {layers.gridLines && generateGridLines()}
        {layers.baseline && generateBaselineWithScales()}
        {layers.mixTriangle && generateMixTriangle()}
        <circle 
          cx={plotPoint.x} 
          cy={plotPoint.y} 
          r="6" 
          fill="red" 
          stroke="white" 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default TernaryPlot;